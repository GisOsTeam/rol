import * as React from 'react';
import { IOneShotButtonTool, withOneShotButtonTool } from '../tool';


export const OneShotCounterButton = withOneShotButtonTool(
  (props: IOneShotButtonTool) => {
    const [count, setCount] = React.useState<number>(0);
    React.useEffect(() => {
      if (props.activated === true) {
        setCount(count + 1);
      }
    }, [props.activated]);
    return <div>One shot count: {String(count)}</div>;
  },
  { className: 'counter-button' }
);
