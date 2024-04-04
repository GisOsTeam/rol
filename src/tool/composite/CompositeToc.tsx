import * as React from 'react';
import styled from 'styled-components';
import { BaseTool, IBaseToolProps } from '../BaseTool';
import { ILayerElement } from '../../LayersManager';
import { ISnapshotSource } from '@gisosteam/aol/source/IExtended';

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

export class CompositeToc extends BaseTool<ICompositeTocProps, never> {
  public static defaultProps = {
    ...BaseTool.defaultProps,
    className: 'toc',
  };

  public getBases(): ILayerElement[] {
    const bases = this.context.layersManager
      .getLayerElements((layerElement) => layerElement.reactElement.props.type.toUpperCase() === 'BASE')
      .sort(
        (layerElement1, layerElement2) =>
          layerElement1.reactElement.props.order - layerElement2.reactElement.props.order,
      );
    return bases;
  }

  public getOverlays(): ILayerElement[] {
    const overlays = this.context.layersManager
      .getLayerElements((layerElement) => {
        const props = layerElement.reactElement.props;
        const source = props.source;
        return (
          props.type.toUpperCase() === 'OVERLAY' &&
          source != null &&
          typeof source.isListable === 'function' &&
          (source as ISnapshotSource).isListable()
        );
      })
      .sort(
        (layerElement1, layerElement2) =>
          layerElement1.reactElement.props.order - layerElement2.reactElement.props.order,
      );
    return overlays;
  }

  public getWorks(): ILayerElement[] {
    const overlays = this.context.layersManager
      .getLayerElements((layerElement) => {
        const props = layerElement.reactElement.props;
        const source = props.source;
        return (
          props.type.toUpperCase() === 'WORK' &&
          source != null &&
          typeof source.isListable === 'function' &&
          (source as ISnapshotSource).isListable()
        );
      })
      .sort(
        (layerElement1, layerElement2) =>
          layerElement1.reactElement.props.order - layerElement2.reactElement.props.order,
      );
    return overlays;
  }

  public handleChange = (newList: ReadonlyArray<ILayerElement>) => {
    let order = 0;
    newList.forEach((layerElement) => {
      this.context.layersManager.updateLayerProps(layerElement.uid, { order });
      order++;
    });
  };

  public renderBasesList() {
    const bases = this.getBases();
    return React.createElement(this.props.basemapsListComponent, {
      ...this.props.basemapsListComponentProps,
      items: bases,
      uid: 'BasesTocList',
    });
  }

  public renderOverlaysList() {
    const overlays = this.getOverlays();
    return React.createElement(this.props.overlaysListComponent, {
      ...this.props.overlaysListComponentProps,
      items: overlays,
      uid: 'OverlaysTocList',
    });
  }

  public renderWorksList() {
    const overlays = this.getWorks();
    return React.createElement(this.props.overlaysListComponent, {
      ...this.props.overlaysListComponentProps,
      items: overlays,
      uid: 'WorksTocList',
    });
  }

  public renderTool(): React.ReactNode {
    if (this.props.disabled === true) {
      return null;
    }
    const bases = this.getBases();
    const overlays = this.getOverlays();
    const works = this.getWorks();
    let height = 1 + 27 * bases.length + 54 * overlays.length + 54 * works.length;
    let overflowy = 'auto';
    if (height > 400) {
      height = 400;
      overflowy = 'scroll';
    }
    if (height < 100) {
      height = 100;
    }
    return (
      <Container className={`${this.props.className} ol-unselectable ol-control`}>
        <SubContainer height={height} overflowy={overflowy}>
          <div>{this.renderBasesList()}</div>
          <div>{this.renderOverlaysList()}</div>
          <div>{this.renderWorksList()}</div>
        </SubContainer>
      </Container>
    );
  }
}
