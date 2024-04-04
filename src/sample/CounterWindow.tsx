import * as React from 'react';
import styled from 'styled-components';
import { IFunctionBaseWindowToolProps, withBaseWindowTool } from '../tool/BaseWindowTool';

const ContainerBtn = styled.div``;

export const CounterWindow = withBaseWindowTool(
  // Content
  (props: IFunctionBaseWindowToolProps) => {
    const [count, setCount] = React.useState<number>(0);
    React.useEffect(() => {
      if (props.activated === true) {
        setCount(count + 1);
      }
    }, [props.activated]);
    return <span>count: {String(count)}</span>;
  },
  // Header Content
  (props: IFunctionBaseWindowToolProps) => {
    return <span>Counter</span>;
  },
  // Open Button Content
  (props: IFunctionBaseWindowToolProps) => {
    return <ContainerBtn>Counter</ContainerBtn>;
  },
  { className: 'counter-window' },
);
