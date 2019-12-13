import * as React from 'react';
import { IBaseWindowToolProps, withBaseWindowTool } from '../tool';

export const CounterWindowFunction = withBaseWindowTool(
  // Content
  (props: IBaseWindowToolProps) => {
    const [count, setCount] = React.useState<number>(0);
    React.useEffect(() => {
      if (props.activated === true) {
        setCount(count + 1);
      }
    }, [props.activated]);
    return <span>count: {String(count)}</span>;
  },
  // Header Content
  (props: IBaseWindowToolProps) => {
    return <span>Counter</span>;
  },
  // Open Button Content
  (props: IBaseWindowToolProps) => {
    return <span>Counter</span>;
  }
);
