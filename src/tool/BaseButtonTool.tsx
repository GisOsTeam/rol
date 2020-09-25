import * as React from 'react';
import styled from 'styled-components';
import { IBaseToolProps, BaseTool } from './BaseTool';
import { RolCssClassNameEnum } from '../RolCssClassNameEnum';

const Button = styled.button<{ activated?: boolean; independant?: boolean; toggle?: boolean }>`
  height: 32px;
  min-width: 32px;
  background-color: ${(props) =>
    props.activated && !props.independant ? 'rgba(245,245,245,0.61)' : 'rgba(213,213,213,0.61)'};
  border-style: solid;
  border-color: ${(props) =>
    props.activated && !props.independant ? 'rgba(145,145,145,0.61)' : 'rgba(172,172,172,0.61)'};
  color: #242424;
  box-shadow: none;
  display: inline-flex;
  border-width: 1px !important;
  border-radius: 5px !important;
  padding-top: 4px;
  ${(props) =>
    props.toggle
      ? `
  &:before {
    margin-right: 5px;
    content: '${props.activated ? '☑' : '☐'}';
  }
  `
      : ''};
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
   * Content
   */
  buttonContent?: string | React.ReactElement;
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
    buttonTitle: '',
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
          this.activate(this.props.independant);
        }
      } else {
        this.activate(this.props.independant);
      }
    }
  };

  public render(): React.ReactNode {
    const rolActivated = this.props.activated ? RolCssClassNameEnum.ACTIVATED : RolCssClassNameEnum.DEACTIVATED;
    const rolEnabled = this.props.disabled ? RolCssClassNameEnum.DISABLED : RolCssClassNameEnum.ENABLED;
    const rolToogled = this.props.toggle ? RolCssClassNameEnum.TOOGLED : null;
    const rolClasses = `${rolActivated} ${rolEnabled} ${rolToogled}`;

    const toggleClass = this.props.toggle ? `${this.props.className}-toggle` : '';
    const activatedClass = this.props.activated
      ? `${this.props.className}-activated`
      : `${this.props.className}-unactivated`;
    const className = `${rolClasses} ${this.props.className}
      ${toggleClass}
      ${activatedClass}
      ${this.props.disabled ? `${this.props.className}-disabled` : `${this.props.className}-enabled`}`;
    return (
      <Button
        className={className}
        title={this.props.buttonTitle}
        onClick={this.handleBaseButtonClick}
        activated={this.props.activated}
        independant={this.props.independant}
        toggle={this.props.toggle}
      >
        {this.renderTool()}
      </Button>
    );
  }
}

export function withBaseButtonTool<P extends IBaseButtonToolProps>(
  component: string | React.FunctionComponent<IBaseButtonToolProps> | React.ComponentClass<IBaseButtonToolProps, {}>,
  defaultProps?: Partial<IBaseButtonToolProps>
) {
  const Tool = class extends BaseButtonTool<P, {}> {
    public renderTool(): React.ReactNode {
      return React.createElement(component, this.props);
    }
  };
  Tool.defaultProps = { ...Tool.defaultProps, ...defaultProps };
  return Tool;
}
