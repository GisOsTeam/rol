import * as React from 'react';
import { createGlobalStyle } from 'styled-components';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import { rolContext } from './RolContext';
import { IBaseToolProps, BaseTool } from './tool/BaseTool';
import { BaseContainer } from './container/BaseContainer';
import { LayersManager } from './LayersManager';
import { ToolsManager } from './ToolsManager';
import { Projection } from './Projection';
import { useViewManager } from './tool/hook/useViewManager';
import { ViewManager } from './ViewManager';

const GlobalStyle = createGlobalStyle`
.ol-unsupported {
  display: none;
}

.ol-viewport, .ol-unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}

.ol-overlaycontainer, .ol-overlaycontainer-stopevent {
  pointer-events: none;
}

.ol-overlaycontainer > *, .ol-overlaycontainer-stopevent > * {
  pointer-events: auto;
}

.ol-selectable {
  -webkit-touch-callout: default;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

.ol-grabbing {
  cursor: -webkit-grabbing;
  cursor: -moz-grabbing;
  cursor: grabbing;
}

.ol-grab {
  cursor: move;
  cursor: -webkit-grab;
  cursor: -moz-grab;
  cursor: grab;
}

.ol-control {
  position: absolute;
}

.ol-hidden {
  opacity: 0;
  visibility: hidden;
  transition: opacity .25s linear, visibility 0s linear .25s;
}
`;

export interface IAfterData {
  olMap: OlMap;
  layersManager: LayersManager;
  toolsManager: ToolsManager;
}

export type after = (data: IAfterData) => void;

export interface IRolProps {
  /**
   * unique id is mandatory.
   */
  uid: string;
  /**
   * Children.
   */
  children: React.ReactNode;
  /**
   * Class name.
   */
  className?: string;
  /**
   * Style.
   */
  style?: React.CSSProperties;
  /**
   * Style.
   */
  olMapStyle?: React.CSSProperties;
  /**
   * Keyboard Event Target.
   */
  keyboardEventTarget?: any;
  /*
   * Ignore default interactions.
   */
  ignoreDefaultInteractions?: boolean;
  /**
   * After mount callback.
   */
  afterMount?: after;
  /**
   * After update callback.
   */
  afterUpdate?: after;
}

export interface IRolState {
  /**
   * Changed counter.
   */
  changedCounter: number;
}

export class Rol extends React.Component<IRolProps, IRolState> {
  public static defaultProps = {
    className: 'map'
  };

  /**
   * OpenLayers map.
   */
  private olMap: OlMap;

  /**
   * Div.
   */
  private divMap: any;

  /**
   * Layers manager.
   */
  private layersManager: LayersManager;

  /**
   * Tools manager.
   */
  private toolsManager: ToolsManager;

  private viewManager: ViewManager;

  constructor(props: IRolProps) {
    super(props);
    this.state = { changedCounter: 0 };
    if (props.ignoreDefaultInteractions === true) {
      this.olMap = new OlMap({
        controls: [],
        interactions: [],
        keyboardEventTarget: props.keyboardEventTarget
      });
    } else {
      this.olMap = new OlMap({
        controls: [],
        keyboardEventTarget: props.keyboardEventTarget
      });
    }
    this.olMap.setView(
      new OlView({
        center: [0, 0],
        zoom: 2
      })
    );
    this.layersManager = new LayersManager(props.uid, this.olMap, this.refresh);
    this.viewManager = new ViewManager(props.uid, this.olMap, this.refresh);
    this.toolsManager = new ToolsManager(props.uid, this.refresh);
  }

  public componentDidMount() {
    this.olMap.setTarget(this.divMap);
    this.layersManager.fromChildren(this.props.children);
    this.toolsManager.fromChildren(this.props.children);
    if (this.props.afterMount) {
      this.props.afterMount.call(this, {
        olMap: this.olMap,
        layersManager: this.layersManager,
        toolsManager: this.toolsManager
      } as IAfterData);
    }
  }

  public componentDidUpdate(prevProps: IRolProps, prevState: IRolState, snap: any) {
    this.layersManager.fromChildren(this.props.children);
    this.toolsManager.fromChildren(this.props.children);
    if (this.props.afterUpdate) {
      this.props.afterUpdate.call(this, {
        olMap: this.olMap,
        layersManager: this.layersManager,
        toolsManager: this.toolsManager
      } as IAfterData);
    }
  }

  public componentWillUnmount() {
    this.viewManager.unregister();
  }
  public refresh = () => {
    this.setState((prevState: IRolState) => {
      return { changedCounter: prevState.changedCounter + 1 };
    });
  };

  public renderProjections(): React.ReactElement<IBaseToolProps>[] {
    const elems: React.ReactElement<IBaseToolProps>[] = [];
    // Projection
    React.Children.map(this.props.children, (child: React.ReactElement<any>) => {
      if (child != null && Projection === child.type) {
        elems.push(child);
      }
    });
    return elems;
  }

  public renderChildren(): React.ReactElement<any>[] {
    const elems: React.ReactElement<any>[] = [];
    // Layers
    this.layersManager.getLayerElements().forEach(layerElement => {
      elems.push(layerElement.reactElement);
    });
    // Tools
    React.Children.map(this.props.children, (child: React.ReactElement<any>) => {
      if (child != null && BaseTool.isPrototypeOf(child.type)) {
        const toolElement = this.toolsManager.getToolElements(toolElement => toolElement.uid == child.props.uid).pop();
        if (toolElement != null) {
          elems.push(toolElement.reactElement);
        }
      }
    });
    // Containers
    React.Children.map(this.props.children, (child: React.ReactElement<any>) => {
      if (child != null && BaseContainer.isPrototypeOf(child.type)) {
        elems.push(child);
      }
    });
    return elems;
  }

  public render(): React.ReactNode {
    return (
      <div key={this.props.uid} className={this.props.className} style={this.props.style}>
        <GlobalStyle />
        {this.renderProjections()}
        <div
          ref={divMap => {
            this.divMap = divMap;
          }}
          className={`${this.props.className}-olmap`}
          style={this.props.olMapStyle}
        />
        <rolContext.Provider
          value={{
            olMap: this.olMap,
            olGroup: this.olMap.getLayerGroup(),
            layersManager: this.layersManager,
            toolsManager: this.toolsManager,
            viewManager: this.viewManager,
            translate: (code: string, defaultText: string, data?: { [key: string]: string }) => {
              return defaultText;
            }
          }}
        >
          {this.renderChildren()}
        </rolContext.Provider>
      </div>
    );
  }
}
