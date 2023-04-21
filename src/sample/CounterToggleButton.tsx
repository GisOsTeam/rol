import * as React from 'react';
import { IBaseButtonToolProps, withBaseButtonTool } from '../tool/BaseButtonTool';

export const CounterToggleButton = withBaseButtonTool(
  (props: IBaseButtonToolProps) => {
    const [count, setCount] = React.useState<number>(0);
    React.useEffect(() => {
      if (props.activated === true) {
        setCount(count + 1);
      }
    }, [props.activated]);
    return <div>count: {String(count)}</div>;
  },
  { className: 'counter-button', toggle: true }
);
