import * as React from 'react';
import { IBaseButtonToolProps, withBaseButtonTool } from '../tool';

export const CounterButtonFunction = withBaseButtonTool((props: IBaseButtonToolProps) => {
  const [count, setCount] = React.useState<number>(0);
  React.useEffect(() => {
    if (props.activated === true) {
      setCount(count + 1);
    }
  }, [props.activated]);
  return <span>count: {String(count)}</span>;
});
