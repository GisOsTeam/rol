import * as React from 'react';
import styled from 'styled-components';
import { rolContext, IRolContext } from '../../RolContext';
import { ILegendRecord, ILegendSource, ISnapshotSource } from '@gisosteam/aol/source/IExtended';
import { IBaseUIItem } from './models/IBaseUIItem';

const DivInline = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const DivInlineSpaceBetween = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-right: 10px;
`;

const DivDragHandle = styled.div`
  width: 10px;
  height: 22px;
  ::after {
    content: '☰';
  }
`;

const DivRemove = styled.div`
  width: 10px;
  height: 22px;
  ::after {
    content: '☒';
  }
`;

const DivMenuClose = styled.div`
  width: 10px;
  height: 22px;
  margin-right: 3px;
  ::after {
    content: '⮞';
  }
`;

const DivMenuOpen = styled.div`
  width: 10px;
  height: 22px;
  margin-right: 3px;
  ::after {
    content: '⮟';
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

export interface ILayerElementItemWithLegendProps extends IBaseUIItem {
  itemSelected: number;
  dragHandleProps: object;

  // Received from DraggableList
  commonProps?: Record<string, any>;
  inputProps?: Record<string, any>;
}

interface LayerElementItemWithLegendState {
  legendRecord: ILegendRecord;
  displayMenu: boolean;
  loading: boolean;
}

export class LayerElementItemWithLegend extends React.Component<
  ILayerElementItemWithLegendProps,
  LayerElementItemWithLegendState
> {
  public static contextType: React.Context<IRolContext> = rolContext;

  public context: IRolContext;

  constructor(props: ILayerElementItemWithLegendProps) {
    super(props);
    this.state = {
      legendRecord: {},
      displayMenu: false,
      loading: false,
    };
  }

  public handleCheckboxChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    this.context.layersManager.updateLayerProps(key, { visible: e.currentTarget.checked });
  };

  public handleRadioChange = (key: string) => (e: React.ChangeEvent) => {
    this.context.layersManager.updateLayerProps(key, { visible: true });
  };

  public handleOpenClose = () => {
    const { item } = this.props;
    if (this.state.displayMenu) {
      this.setState({ displayMenu: false });
      return;
    }
    this.setState({ displayMenu: true });
    const source = item.reactElement.props.source;
    if (source != null && typeof source.fetchLegend === 'function') {
      this.setState({ loading: true });
      (source as ILegendSource).fetchLegend().then(
        (rec) => {
          this.setState({ legendRecord: rec, loading: false });
        },
        () => {
          this.setState({ legendRecord: null, loading: false });
        }
      );
    }
  };

  public handleRemove = () => {
    const { item } = this.props;
    this.context.layersManager.removeLayer(item.uid);
  };

  public renderMenu() {
    const { item } = this.props;
    const { legendRecord } = this.state;
    let legend = null;
    if (legendRecord != null) {
      legend = Object.values(legendRecord).map((lgd, index) => {
        return (
          <div key={index}>
            {lgd.map((layerLgd, li) => {
              const label = layerLgd.label ? layerLgd.label : null;
              return (
                layerLgd.height > 0 &&
                layerLgd.width > 0 && (
                  <span key={li}>
                    <img src={layerLgd.srcImage} height={layerLgd.height} width={layerLgd.width} />
                    {label}
                  </span>
                )
              );
            })}
          </div>
        );
      });
    }
    const source = item.reactElement.props.source;
    return (
      <div>
        {legend}
        {typeof source.isRemovable === 'function' && (source as ISnapshotSource).isRemovable() && (
          <DivRemove onClick={this.handleRemove} title={this.context.translate('toc.remove', 'Remove')} />
        )}
      </div>
    );
  }

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

        let menuOpenCloseIndicator = null;
        if (this.state.displayMenu) {
          menuOpenCloseIndicator = <DivMenuOpen />;
        } else {
          menuOpenCloseIndicator = <DivMenuClose />;
        }

        return (
          <div>
            <DivInline>
              <DivDragHandle {...dragHandleProps} />
              {input}
              <DivInlineSpaceBetween onClick={this.handleOpenClose}>
                {this.renderLabel()}
                {menuOpenCloseIndicator}
              </DivInlineSpaceBetween>
            </DivInline>
            {this.state.displayMenu && <div>{this.renderMenu()}</div>}
          </div>
        );
      }
    }
    return null;
  }
}
