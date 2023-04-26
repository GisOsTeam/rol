import * as React from 'react';
import { RolCssClassNameEnum } from '../RolCssClassNameEnum';
import '../style/tool/BaseButtonTool.css';
import { BaseTool, IBaseToolProps } from './BaseTool';

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

export class BaseButtonTool<P extends IBaseButtonToolProps = IBaseButtonToolProps, S = never> extends BaseTool<P, S> {
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
    const rolClasses = `rol-base-btn-tool ${rolActivated} ${rolEnabled}`;

    const toggleClass = this.props.toggle ? `${this.props.className}-toggle` : '';
    const activatedClass = this.props.activated
      ? `${this.props.className}-activated`
      : `${this.props.className}-unactivated`;
    const className = `${rolClasses} ${this.props.className}
      ${toggleClass}
      ${activatedClass}
      ${this.props.disabled ? `${this.props.className}-disabled` : `${this.props.className}-enabled`}`;
      return (
      <button
        className={className}
        title={this.props.buttonTitle}
        data-activated={this.props.activated}
        data-toggle={this.props.toggle}
        data-independant={this.props.independant}
        onClick={this.handleBaseButtonClick}
      >
        {this.renderTool()}
      </button>
    );
  }
}

export function withBaseButtonTool<P extends IBaseButtonToolProps>(
  component: string | React.FunctionComponent<IBaseButtonToolProps> | React.ComponentClass<IBaseButtonToolProps, never>,
  defaultProps?: Partial<IBaseButtonToolProps>
) {
  const Tool = class extends BaseButtonTool<P, never> {
    public renderTool(): React.ReactNode {
      return React.createElement(component, this.props);
    }
  };
  Tool.defaultProps = { ...Tool.defaultProps, ...defaultProps };
  return Tool;
}
