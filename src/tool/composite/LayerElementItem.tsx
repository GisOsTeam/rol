import * as React from 'react';
import styled from 'styled-components';
import { rolContext, IRolContext } from '../../RolContext';
import { IExtended } from '@gisosteam/aol/source/IExtended';
import { ILayerElement } from '../../LayersManager';

const DivInline = styled.div`
  display: inline-flex;
`;

const DivDragHandle = styled.div`
  width: 10px;
  height: 22px;
  ::after {
    content: '☰';
  }
`;

export interface ILayerElementItemProps {
  item: ILayerElement;
  itemSelected: number;
  dragHandleProps: object;
}

interface LayerElementItemState {}

export class LayerElementItem extends React.Component<ILayerElementItemProps, LayerElementItemState> {
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
