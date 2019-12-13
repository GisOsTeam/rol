import * as React from 'react';
import { IBaseButtonToolProps, BaseButtonTool } from '../tool';

export class CounterButton extends BaseButtonTool<IBaseButtonToolProps, any> {
  public constructor(props: IBaseButtonToolProps) {
    super(props);
    this.state = { count: 0 };
  }

  public toolDidActivate(): void {
    this.setState({
      count: this.state.count + 1
    });
  }

  public renderTool(): React.ReactNode {
    return <span>count: {String(this.state.count)}</span>;
  }
}
