import * as React from 'react';
import styled from 'styled-components';
import { IBaseWindowToolProps, BaseWindowTool } from '../tool/BaseWindowTool';

const ContainerBtn = styled.div`
  height: 28px;
`;

export class CounterWindow extends BaseWindowTool<IBaseWindowToolProps, any> {
  public static defaultProps = {
    ...BaseWindowTool.defaultProps,
    className: 'counter-window'
  };

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
    return <ContainerBtn>Counter</ContainerBtn>;
  }

  public renderTool(): React.ReactNode {
    return <span>count: {String(this.state.count)}</span>;
  }
}
