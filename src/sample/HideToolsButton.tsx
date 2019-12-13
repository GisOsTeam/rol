import * as React from 'react';
import { IBaseButtonToolProps, BaseButtonTool } from '../tool';

export interface IHideToolsButtonProps extends IBaseButtonToolProps {
  hideTools: boolean;
  setHideTools: (hideTools: boolean) => void;
}

export class HideToolsButton extends BaseButtonTool<IHideToolsButtonProps, any> {
  public static defaultProps = {
    ...BaseButtonTool.defaultProps,
    toggle: true
  };

  public handleButtonClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.props.setHideTools(!this.props.hideTools);
  };

  public renderTool(): React.ReactNode {
    return <span onClick={this.handleButtonClick2}>Hide tools</span>;
  }
}
