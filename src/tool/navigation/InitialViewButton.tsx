import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../BaseButtonTool';
import { useViewManager } from '../hook/useViewManager';

const ContainerBtn = styled.div`
  height: 28px;
`;

export const InitialViewButton = withBaseButtonTool(
  (props: IBaseButtonToolProps) => {
    const { fitToInitial } = useViewManager();
    React.useEffect(() => {
      if (props.activated === true) {
        fitToInitial();
      }
    }, [props.activated]);
    return <ContainerBtn>Initial View</ContainerBtn>;
  },
  { className: 'counter-button', toggle: false }
);
