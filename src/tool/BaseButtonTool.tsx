import * as React from 'react';
import styled from 'styled-components';
import { IBaseToolProps, BaseTool } from './BaseTool';

const Button = styled.button`
  margin: 0px;
  padding: 0px;
  border-radius: 6px;
  border: 1px solid #dcdcdc;
  box-shadow: inset 0px 1px 0px 0px #ffffff;
  background: linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%);
  background-color: #ffffff;
  color: #444;
  text-decoration: none;
  text-shadow: 0px 1px 0px #ffffff;
  &:hover {
    background: linear-gradient(to bottom, #f6f6f6 5%, #ffffff 100%);
    background-color: #f6f6f6;
  }
`;

export interface IBaseButtonToolProps extends IBaseToolProps {
  /**
   * Toggle.
   */
  toggle?: boolean;
  /**
   * Title.
   */
  buttonTitle?: string;
  /**
   * Click handler.
   */
  onButtonClick?: () => void;
}

export class BaseButtonTool<P extends IBaseButtonToolProps = IBaseButtonToolProps, S = {}> extends BaseTool<P, S> {
  public static defaultProps = {
    ...BaseTool.defaultProps,
    toggle: false,
    className: 'button-tool',
    buttonTitle: ''
  };

  public handleBaseButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!this.props.disabled) {
      if (this.props.onButtonClick) {
        this.props.onButtonClick();
      }
      if (this.props.toggle) {
        if (this.props.activated) {
          this.deactivate();
        } else {
          this.activate();
        }
      } else {
        this.activate();
      }
    }
  };

  public render(): React.ReactNode {
    const className = `${this.props.className}
      ${this.props.toggle ? `${this.props.className}-toggle` : ''}
      ${this.props.activated ? `${this.props.className}-activated` : `${this.props.className}-unactivated`}
      ${this.props.disabled ? `${this.props.className}-disabled` : `${this.props.className}-enabled`}`;
    return (
      <Button className={className} title={this.props.buttonTitle} onClick={this.handleBaseButtonClick}>
        {this.renderTool()}
      </Button>
    );
  }
}

export function withBaseButtonTool<P extends IBaseButtonToolProps>(
  component: string | React.FunctionComponent<IBaseButtonToolProps> | React.ComponentClass<IBaseButtonToolProps, {}>,
  defaultProps?: Partial<IBaseButtonToolProps>
) {
  const tool = class extends BaseButtonTool<P, {}> {
    public renderTool(): React.ReactNode {
      return React.createElement(component, this.props);
    }
  };
  tool.defaultProps = { ...tool.defaultProps, ...defaultProps };
  return tool;
}
