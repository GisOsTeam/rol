import * as React from 'react';
import { IBaseToolProps, BaseTool } from './BaseTool';

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
      ${this.props.disabled ? `${this.props.className}-disabled` : `${this.props.className}-activated`}`;
    return (
      <button className={className} title={this.props.buttonTitle} onClick={this.handleBaseButtonClick}>
        {this.renderTool()}
      </button>
    );
  }
}
