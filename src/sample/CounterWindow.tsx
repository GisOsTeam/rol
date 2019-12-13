import * as React from 'react';
import { IBaseWindowToolProps, BaseWindowTool } from '../tool';

export class CounterWindow extends BaseWindowTool<IBaseWindowToolProps, any> {
  public constructor(props: IBaseWindowToolProps) {
    super(props);
    this.state = { count: 0 };
  }

  public toolDidActivate(): void {
    this.setState({
      count: this.state.count + 1
    });
  }

  public renderHeaderContent(): React.ReactNode {
    return <span>Counter</span>;
  }

  public renderOpenButtonContent(): React.ReactNode {
    return <span>Counter</span>;
  }

  public renderTool(): React.ReactNode {
    return <span>count: {String(this.state.count)}</span>;
  }
}
