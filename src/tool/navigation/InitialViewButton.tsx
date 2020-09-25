import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../BaseButtonTool';
import { useViewManager } from '../hook/useViewManager';

const ContainerBtn = styled.div``;

export const InitialViewButton = withBaseButtonTool(
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
