import * as React from 'react';
import styled from 'styled-components';
import { rolContext, IRolContext } from '../../RolContext';
import { IExtended } from '@gisosteam/aol/source/IExtended';
import { IBaseUIItem } from './models/IBaseUIItem';
import { ImageArcGISRest } from '@gisosteam/aol/source/ImageArcGISRest';
import { ImageWms } from '@gisosteam/aol/source/ImageWms';
import { TileWms } from '@gisosteam/aol/source/TileWms';

const DivInline = styled.div`
  display: inline-flex;
  width: 100%;
`;

const DivDragHandle = styled.div`
  width: 10px;
  height: 22px;
  ::after {
    content: '☰';
  }
`;
export interface ILayerLegend {
  label?: string;
  /**
   * Either a base64 or an URL
   */
  srcImage: string;
  height?: number;
  width?: number;
}

export interface ILayerElementItemProps extends IBaseUIItem {
  itemSelected: number;
  dragHandleProps: object;

  // Received from DraggableList
  commonProps?: Record<string, any>;
  inputProps?: Record<string, any>;
}

interface LayerElementItemWithLegendState {
  inputProps?: Pick<ILayerElementItemProps, 'inputProps'>;
  legendByLayer: Record<string, ILayerLegend[]>;

  displayLegend: boolean;
}

export class LayerElementItemWithLegend extends React.Component<
  ILayerElementItemProps,
  LayerElementItemWithLegendState
> {
  public static contextType: React.Context<IRolContext> = rolContext;

  public context: IRolContext;

  private mounted: boolean;

  private promLegend: Promise<Record<string, ILayerLegend[]>>;

  constructor(props: ILayerElementItemProps) {
    super(props);
    this.state = {
      legendByLayer: {},
      displayLegend: false,
    };
  }

  /**
   * @todo upgrade AOL pour récupérer la légende depuis la source
   *
   */

  async componentDidMount() {
    const { item } = this.props;
    this.mounted = true;
    const elementProps = item.reactElement.props;
    const source = elementProps['source'];

    let legendByLayer: Record<string, ILayerLegend[]> = {};
    if(source.fetchLegend) {
      this.promLegend = source.fetchLegend();
      legendByLayer = await this.promLegend;
    }

    // A ne pas faire mais c'est temporaire
    if (this.mounted && legendByLayer) {
      this.setState({ legendByLayer });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }
  
  /**
   * RTFM
   * Called before render
   * @param props
   * @param state
   */
  static getDerivedStateFromProps(props: ILayerElementItemProps, state: LayerElementItemWithLegendState) {
    return {
      ...state,
      inputProps: {
        ...props.commonProps.inputProps,
        ...props.inputProps,
      },
    };
  }

  public handleCheckboxChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    this.context.layersManager.updateLayerProps(key, { visible: e.currentTarget.checked });
  };

  public handleRadioChange = (key: string) => (e: React.ChangeEvent) => {
    this.context.layersManager.updateLayerProps(key, { visible: true });
  };

  public renderLegend() {
    const { displayLegend, legendByLayer } = this.state;
    if (displayLegend && legendByLayer) {
      return Object.values(legendByLayer).map((lgd, index) => {
        return (
          <div key={index}>
            {lgd.map((layer, li) => {
              const label = layer.label ? layer.label : null;
              return (
                <span key={li}>
                  <img src={layer.srcImage} />
                  {label}
                </span>
              );
            })}
          </div>
        );
      });
    }
  }

  public render(): React.ReactNode {
    const { item, dragHandleProps } = this.props;
    const elementProps = item.reactElement.props;
    const source = elementProps['source'];
    if (source != null && 'isListable' in source) {
      if ((source as IExtended).isListable()) {
        const name = item.reactElement.props.name || '';
        let truncName = name;
        if (truncName.length > 15) {
          truncName = truncName.substring(0, 14) + '…';
        }
        let title = '';
        if (truncName !== name) {
          title = name;
        }
        if (item.reactElement.props.description != null && item.reactElement.props.description != '') {
          if (title.length > 0) {
            title += '\n';
          }
          title += item.reactElement.props.description;
        }
        if (title === '') {
          title = name;
        }

        let input;
        if (this.state.inputProps) {
          input = React.createElement('input', {
            ...this.state.inputProps,
            checked: item.reactElement.props.visible !== false ? true : false,
            onChange: this.handleCheckboxChange(item.uid),
          });
        }

        const label = (
          <label title={title} onClick={() => this.setState({ displayLegend: !this.state.displayLegend })}>
            {truncName}
          </label>
        );
        return (
          <div>
            <DivInline>
              <DivDragHandle {...dragHandleProps} />
              {input}
              {label}
            </DivInline>
            <div>{this.renderLegend()}</div>
          </div>
        );
      }
    }
    return null;
  }
}
