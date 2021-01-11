import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../BaseButtonTool';
import { useViewManager } from '../hook/useViewManager';
import { withOneShotButtonTool } from '../OneShotButtonTool';

const ContainerBtn = styled.div``;

export const InitialViewButton = withOneShotButtonTool(
  ({ activated = false, buttonContent = '🌍' }: IBaseButtonToolProps) => {
    const { fitToInitial } = useViewManager();
    React.useEffect(() => {
      if (activated === true) {
        fitToInitial();
      }
    }, [activated]);
    return <ContainerBtn>{buttonContent}</ContainerBtn>;
  },
  { className: 'initial-view-button', independant: true, buttonTitle: 'Initial View' }
);
