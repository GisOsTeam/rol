import * as React from 'react';
import styled from 'styled-components';
import { rolContext, IRolContext } from '../../RolContext';
import { ISnapshotSource } from '@gisosteam/aol/source/IExtended';
import { IBaseUIItem } from './models/IBaseUIItem';

const DivInline = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const DivDragHandle = styled.div`
  width: 10px;
  height: 22px;
  &:after {
    content: '☰';
  }
`;

const Label = styled.label`
  width: 142px;
  white-space: nowrap;
  font-size: 14px;
  background: linear-gradient(
    90deg,
    rgba(36, 36, 36, 1) 0%,
    rgba(36, 36, 36, 0.9) 60%,
    rgba(36, 36, 36, 0.5) 95%,
    rgba(36, 36, 36, 0) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export interface ILayerElementItemProps extends IBaseUIItem {
  itemSelected: number;
  dragHandleProps: object;

  // Received from DraggableList
  commonProps?: Record<string, any>;
  inputProps?: Record<string, any>;
}

export class LayerElementItem extends React.Component<ILayerElementItemProps, never> {
  public static contextType: React.Context<IRolContext> = rolContext;

  public context: IRolContext;

  public handleCheckboxChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    this.context.layersManager.updateLayerProps(key, { visible: e.currentTarget.checked });
  };

  public handleRadioChange = (key: string) => (e: React.ChangeEvent) => {
    this.context.layersManager.updateLayerProps(key, { visible: true });
  };

  public renderLabel() {
    const { item } = this.props;
    const name = item.reactElement.props.name || '';
    let title = name;
    if (item.reactElement.props.description != null && item.reactElement.props.description != '') {
      if (title.length > 0) {
        title += '\n';
      }
      title += item.reactElement.props.description;
    }
    if (title === '') {
      title = name;
    }
    return <Label title={title}>{name}</Label>;
  }

  public render(): React.ReactNode {
    const { item, dragHandleProps } = this.props;
    const elementProps = item.reactElement.props;
    const source = elementProps.source;
    if (source != null && typeof source.isListable === 'function') {
      if ((source as ISnapshotSource).isListable()) {
        let input;
        if (this.props.commonProps != null || this.props.inputProps != null) {
          input = React.createElement('input', {
            ...this.props.commonProps.inputProps,
            ...this.props.inputProps,
            checked: item.reactElement.props.visible !== false ? true : false,
            onChange: this.handleCheckboxChange(item.uid),
          });
        }

        return (
          <div>
            <DivInline>
              <DivDragHandle {...dragHandleProps} />
              {input}
              {this.renderLabel()}
            </DivInline>
          </div>
        );
      }
    }
    return null;
  }
}
