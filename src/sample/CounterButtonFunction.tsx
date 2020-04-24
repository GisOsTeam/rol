import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../tool/BaseButtonTool';
import { usePrevious } from '../tool/hook/usePrevious';

const ContainerBtn = styled.div`
  height: 28px;
`;

const functionalButton = (props: IBaseButtonToolProps) => {
  const [count, setCount] = React.useState<number>(0);
  const oldCount = usePrevious(count);
  React.useEffect(() => {
    // Si le previous n'est pas undefined, i.e. si on n'est pas dans le didMount
    if (typeof oldCount === 'number') {
      setCount(count + 1);
    }
  }, [props.activated]);
  return <ContainerBtn>count: {String(count)}</ContainerBtn>;
}

export const CounterButtonFunction = withBaseButtonTool(functionalButton,  { className: 'counter-button' });
