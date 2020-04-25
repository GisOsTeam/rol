import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, BaseButtonTool } from '../tool/BaseButtonTool';

const ContainerBtn = styled.div`
  height: 28px;
`;

export class CounterButton extends BaseButtonTool<IBaseButtonToolProps, any> {
  public static defaultProps = {
    ...BaseButtonTool.defaultProps,
    className: 'counter-button',
  };

  public constructor(props: IBaseButtonToolProps) {
    super(props);
    this.state = { count: 0 };
  }

  public toolDidActivate(): void {
    this.setState({
      count: this.state.count + 1,
    });
  }

  public renderTool(): React.ReactNode {
    return <ContainerBtn>count: {String(this.state.count)}</ContainerBtn>;
  }
}
