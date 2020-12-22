import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps } from '../BaseButtonTool';
import { useViewManager } from '../hook/useViewManager';
import { withOneShotButtonTool } from '../OneShotButtonTool';

const ContainerBtn = styled.div``;

export const PreviousViewButton = withOneShotButtonTool(
  (props: IBaseButtonToolProps) => {
    const { activated = false, buttonContent = '⤺' } = props;
    const { fitToPrevious } = useViewManager();
    React.useEffect(() => {
      if (activated === true) {
        fitToPrevious();
      }
    }, [activated]);
    return <ContainerBtn>{buttonContent}</ContainerBtn>;
  },
  { className: 'previous-view-button', independant: true, buttonTitle: 'Previous View' }
);
