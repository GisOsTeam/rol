import * as React from 'react';
import styled from 'styled-components';
import { BaseTool, IBaseToolProps } from '../BaseTool';
import { ILayerElement } from '../../LayersManager';

const Container = styled.div`
  top: 15px;
  right: 15px;
  background-color: rgba(213, 213, 213, 0.61);
  border-style: solid;
  border-color: rgba(172, 172, 172, 0.61);
  border-width: 1px;
  border-radius: 5px;
  color: #242424;
  box-shadow: none;
`;

const SubContainer = styled.div<{ height: number; overflowy: string }>`
  width: 200px;
  height: ${(props) => `${props.height}px`};
  margin: 2px;
  overflow-y: ${(props) => props.overflowy};
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

export interface IComposedTocProps extends IBaseToolProps {
  /**
   * Class name.
   */
  className?: string;
}

export interface ICompositeTocProps extends IComposedTocProps {
  basemapsListComponent?: any;
  basemapsListComponentProps?: Record<string, any>;
  overlaysListComponent?: any;
  overlaysListComponentProps?: Record<string, any>;
}

export class CompositeToc extends BaseTool<ICompositeTocProps, {}> {
  public static defaultProps = {
    ...BaseTool.defaultProps,
    className: 'toc',
  };

  public getBases(): ILayerElement[] {
    const overlays: ILayerElement[] = [];
    this.context.layersManager
      .getLayerElements((layerElement) => layerElement.reactElement.props.type === 'BASE')
      .sort(
        (layerElement1, layerElement2) =>
          layerElement1.reactElement.props.order - layerElement2.reactElement.props.order
      )
      .forEach((layerElement) => {
        overlays.push(layerElement);
      });
    return overlays;
  }

  public getOverlays(): ILayerElement[] {
    const overlays: ILayerElement[] = [];
    this.context.layersManager
      .getLayerElements((layerElement) => layerElement.reactElement.props.type === 'OVERLAY')
      .sort(
        (layerElement1, layerElement2) =>
          layerElement1.reactElement.props.order - layerElement2.reactElement.props.order
      )
      .forEach((layerElement) => {
        overlays.push(layerElement);
      });
    return overlays;
  }

  public handleChange = (newList: ReadonlyArray<ILayerElement>) => {
    let order = 0;
    newList.forEach((layerElement) => {
      this.context.layersManager.updateLayerProps(layerElement.uid, { order });
      order++;
    });
  };

  public renderBaseList() {
    const bases = this.getBases();
    return React.createElement(this.props.basemapsListComponent, {
      ...this.props.basemapsListComponentProps,
      items: bases,
      uid: 'BaseTocList',
    });
  }

  public renderOverlayList() {
    const overlays = this.getOverlays();
    return React.createElement(this.props.overlaysListComponent, {
      ...this.props.overlaysListComponentProps,
      items: overlays,
      uid: 'OverlaysTocList',
    });
  }

  public renderTool(): React.ReactNode {
    if (this.props.disabled === true) {
      return null;
    }
    const bases = this.getBases();
    const overlay = this.getOverlays();
    let height = 1 + 27 * (bases.length + overlay.length);
    let overflowy = 'hidden';
    if (height > 400) {
      height = 400;
      overflowy = 'scroll';
    }
    return (
      <Container className={`${this.props.className} ol-unselectable ol-control`}>
        <SubContainer height={height} overflowy={overflowy}>
          <div>{this.renderBaseList()}</div>
          <div>{this.renderOverlayList()}</div>
        </SubContainer>
      </Container>
    );
  }
}
