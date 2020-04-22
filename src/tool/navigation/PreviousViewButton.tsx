import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../BaseButtonTool';
import { useViewHistory } from '../hook/useViewManager';

const ContainerBtn = styled.div`
  height: 28px;
`;

export const PreviousViewButton = withBaseButtonTool(
    (props: IBaseButtonToolProps) => {
        const [ fitToPrevious ] = useViewHistory({});
        React.useEffect(() => {
          console.log("Useefect", props);
          if (props.activated === true) {
            fitToPrevious();
          }
        }, [props.activated]);
        return <ContainerBtn>Previous</ContainerBtn>;
    },
    { className: 'counter-button', toggle: false }
  );
