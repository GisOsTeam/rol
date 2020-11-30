import * as React from 'react';
import styled from 'styled-components';
import { IOneShotButtonTool, withOneShotButtonTool } from '../tool';

const ContainerBtn = styled.div``;

export const OneShotCounterButton = withOneShotButtonTool(
  (props: IOneShotButtonTool) => {
    const [count, setCount] = React.useState<number>(0);
    React.useEffect(() => {
      if (props.activated === true) {
        setCount(count + 1);
      }
    }, [props.activated]);
    return <ContainerBtn>One shot count: {String(count)}</ContainerBtn>;
  },
  { className: 'counter-button' }
);
