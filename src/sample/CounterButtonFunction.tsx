import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../tool/BaseButtonTool';

const ContainerBtn = styled.div`
  height: 28px;
`;

export const CounterButtonFunction = withBaseButtonTool(
  (props: IBaseButtonToolProps) => {
    const [count, setCount] = React.useState<number>(0);
    React.useEffect(() => {
      if (props.activated === true) {
        setCount(count + 1);
      }
    }, [props.activated]);
    return <ContainerBtn>count: {String(count)}</ContainerBtn>;
  },
  { className: 'counter-button' }
);
