import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../BaseButtonTool';
import { useViewManager } from '../hook/useViewManager';

const ContainerBtn = styled.div``;

export const PreviousViewButton = withBaseButtonTool(
  (props: IBaseButtonToolProps) => {
    const {activated = false, buttonContent = '⤺'} = props;
    const { fitToPrevious } = useViewManager();
    React.useEffect(() => {
      if (activated === true) {
        fitToPrevious();
      }
    }, [activated]);
    return <ContainerBtn>
      {buttonContent}
    </ContainerBtn>;
  },
  { className: 'previous-view-button', independant: true, buttonTitle: 'Previous View' }
);
