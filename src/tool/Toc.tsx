import * as React from 'react';
import styled from 'styled-components';
import { rolContext, IRolContext } from '../RolContext';
import { BaseTool, IBaseToolProps } from './BaseTool';
import { IExtended } from '@gisosteam/aol/source/IExtended';

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

export interface ITocProps extends IBaseToolProps {
  /**
   * Class name.
   */
  className?: string;
}

export class Toc extends BaseTool<ITocProps, {}> {
  public static contextType: React.Context<IRolContext> = rolContext;

  public static defaultProps = {
    ...BaseTool.defaultProps,
    className: 'toc',
  };

  public context: IRolContext;

  public handleRadioChange = (key: string) => (e: React.ChangeEvent) => {
    this.context.layersManager.updateLayerProps(key, { visible: true });
  };

  public handleCheckboxChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    this.context.layersManager.updateLayerProps(key, { visible: e.currentTarget.checked });
  };

  public renderBaseList(parentId: string = 'map'): React.ReactNodeArray {
    const bases: React.ReactNodeArray = [];
    this.context.layersManager
      .getLayerElements((layerElement) => layerElement.reactElement.props.type === 'BASE')
      .forEach((layerElement) => {
        const source = layerElement.reactElement.props['source'];
        if (source != null && 'isListable' in source) {
          if ((source as IExtended).isListable()) {
            const name = layerElement.reactElement.props.name || '';
            let truncName = name;
            if (truncName.length > 15) {
              truncName = truncName.substring(0, 14) + '…';
            }
            let title = '';
            if (truncName !== name) {
              title = name;
            }
            if (
              layerElement.reactElement.props.description != null &&
              layerElement.reactElement.props.description != ''
            ) {
              if (title.length > 0) {
                title += '\n';
              }
              title += layerElement.reactElement.props.description;
            }
            if (title === '') {
              title = name;
            }
            bases.push(
              <DivInline key={layerElement.uid}>
                <input
                  type="radio"
                  name="radiotoc"
                  checked={layerElement.reactElement.props.visible !== false ? true : false}
                  onChange={this.handleRadioChange(layerElement.uid)}
                />
                <label title={title} style={{ whiteSpace: 'pre-wrap' }}>
                  {truncName}
                </label>
              </DivInline>
            );
          }
        }
      });
    return bases;
  }

  public renderOverlayTree(parentId: string = 'map'): React.ReactNodeArray {
    const overlayTree: React.ReactNodeArray = [];
    this.context.layersManager
      .getLayerElements((layerElement) => layerElement.reactElement.props.type === 'OVERLAY')
      .forEach((layerElement) => {
        const source = layerElement.reactElement.props['source'];
        if (source != null && 'isListable' in source) {
          if ((source as IExtended).isListable()) {
            const name = layerElement.reactElement.props.name || '';
            let truncName = name;
            if (truncName.length > 15) {
              truncName = truncName.substring(0, 14) + '…';
            }
            let title = '';
            if (truncName !== name) {
              title = name;
            }
            if (
              layerElement.reactElement.props.description != null &&
              layerElement.reactElement.props.description != ''
            ) {
              if (title.length > 0) {
                title += '\n';
              }
              title += layerElement.reactElement.props.description;
            }
            if (title === '') {
              title = name;
            }
            const input = (
              <input
                type="checkbox"
                checked={layerElement.reactElement.props.visible !== false ? true : false}
                onChange={this.handleCheckboxChange(layerElement.uid)}
              />
            );
            const label = <label title={title}>{truncName}</label>;
            overlayTree.push(
              <DivInline key={layerElement.uid}>
                {input}
                {label}
              </DivInline>
            );
          }
        }
      });
    return overlayTree;
  }

  public renderTool(): React.ReactNode {
    if (this.props.disabled === true) {
      return null;
    }
    return (
      <Container className={`${this.props.className} ol-unselectable ol-control`}>
        <SubContainer>
          {this.renderBaseList()}
          {this.renderOverlayTree()}
        </SubContainer>
      </Container>
    );
  }
}
