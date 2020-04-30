import * as React from 'react';
import styled from 'styled-components';
import { rolContext, IRolContext } from '../RolContext';
import { BaseTool, IBaseToolProps } from './BaseTool';
import { IExtended } from '@gisosteam/aol/source/IExtended';
import DraggableList from 'react-draggable-list';
import { ILayerElement } from '../LayersManager';

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

const SubContainer = styled.div`
  width: 200px;
  max-height: 400px;
  margin: 2px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const SpanParentSubTree = styled.span`
  ::after {
    margin-left: 10px;
    margin-botom: 2px;
    content: '▶';
  }
`;

const DivSubTree = styled.div`
  margin-left: 20px;
`;

const DivInline = styled.div`
  display: inline-flex;
`;

const DivDragHandle = styled.div`
  width: 10px;
  height: 10px;
  ::after {
    content: '☰';
  }
`;

interface ILayerElementItemProps {
  item: ILayerElement;
  itemSelected: number;
  dragHandleProps: object;
}

interface LayerElementItemState {}

class LayerElementItem extends React.Component<ILayerElementItemProps, LayerElementItemState> {
  public static contextType: React.Context<IRolContext> = rolContext;

  public context: IRolContext;

  public handleCheckboxChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    this.context.layersManager.updateLayerProps(key, { visible: e.currentTarget.checked });
  };

  public handleRadioChange = (key: string) => (e: React.ChangeEvent) => {
    this.context.layersManager.updateLayerProps(key, { visible: true });
  };

  public render(): React.ReactNode {
    const { item, itemSelected, dragHandleProps } = this.props;
    const source = item.reactElement.props['source'];
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
        if (item.reactElement.props.type === 'OVERLAY') {
          input = (
            <input
              type="checkbox"
              checked={item.reactElement.props.visible !== false ? true : false}
              onChange={this.handleCheckboxChange(item.uid)}
            />
          );
        } else {
          input = (
            <input
              type="radio"
              name="radiotoc"
              checked={item.reactElement.props.visible !== false ? true : false}
              onChange={this.handleRadioChange(item.uid)}
            />
          );
        }
        const label = <label title={title}>{truncName}</label>;
        return (
          <DivInline>
            <DivDragHandle {...dragHandleProps} />
            {input}
            {label}
          </DivInline>
        );
      }
    }
    return null;
  }
}

export interface ITocProps extends IBaseToolProps {
  /**
   * Class name.
   */
  className?: string;
}

export class Toc extends BaseTool<ITocProps, {}> {
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

  public handleChange = (
    newList: ReadonlyArray<ILayerElement>,
    movedItem: ILayerElement,
    oldIndex: number,
    newIndex: number
  ) => {
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
    return (
      <Container className={`${this.props.className} ol-unselectable ol-control`}>
        <SubContainer>
          <div>
            <DraggableList<ILayerElement, void, LayerElementItem>
              itemKey="uid"
              list={this.getBases()}
              template={LayerElementItem}
              onMoveEnd={this.handleChange}
              constrainDrag={true}
            />
          </div>
          <div>
            <DraggableList<ILayerElement, void, LayerElementItem>
              itemKey="uid"
              list={this.getOverlays()}
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
