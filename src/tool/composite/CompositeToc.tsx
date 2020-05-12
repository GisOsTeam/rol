import * as React from 'react';
import styled from 'styled-components';
import { rolContext, IRolContext } from '../../RolContext';
import { BaseTool, IBaseToolProps } from '../BaseTool';
import { IExtended } from '@gisosteam/aol/source/IExtended';
import DraggableList from 'react-draggable-list';
import { ILayerElement } from '../../LayersManager';
import { LayerElementItem, ILayerElementItemProps } from './LayerElementItem';
import { SimpleList } from './SimpleList';
import { DraggableListAdaptator } from './DraggableListAdaptater';

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

export interface ITocProps extends IBaseToolProps {
  /**
   * Class name.
   */
  className?: string;
}

export class CompositeToc extends BaseTool<ITocProps, {}> {
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
          <div>
            <DraggableListAdaptator<ILayerElement, ILayerElementItemProps, LayerElementItem>
                items={bases}
                uid='BaseTocList'
                itemComponent={LayerElementItem}
                itemComponentProps={{
                    item: null,
                    itemSelected: -1,
                    dragHandleProps: null,
                    onMoveEnd: this.handleChange,
                    constrainDrag: true
                }}
            />
          </div>
          <hr />
          <div>
            <DraggableList<ILayerElement, void, LayerElementItem>
              itemKey="uid"
              list={bases}
              template={LayerElementItem}
              onMoveEnd={this.handleChange}
              constrainDrag={true}
            />
          </div>
          <div>
            <DraggableList<ILayerElement, void, LayerElementItem>
              itemKey="uid"
              list={overlay}
              template={LayerElementItem}
              onMoveEnd={this.handleChange}
              constrainDrag={true}
            />
          </div>
        </SubContainer>
      </Container>
    );
  }
}
