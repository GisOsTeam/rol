import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../BaseButtonTool';
import { useViewManager } from '../hook/useViewManager';

const ContainerBtn = styled.div`
  height: 28px;
`;

export const NextViewButton = withBaseButtonTool(
  (props: IBaseButtonToolProps) => {
    const { fitToNext } = useViewManager();
    React.useEffect(() => {
      if (props.activated === true) {
        fitToNext();
      }
    }, [props.activated]);
    return <ContainerBtn>Next</ContainerBtn>;
  },
  { className: 'counter-button', toggle: false }
);
