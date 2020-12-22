import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../BaseButtonTool';
import { useViewManager } from '../hook/useViewManager';
import { useTranslate } from '../hook/useTranslate';
import { withOneShotButtonTool } from '../OneShotButtonTool';

const ContainerBtn = styled.div``;

export const NextViewButton = withOneShotButtonTool(
  ({ activated = false, buttonContent = '⤻' }: IBaseButtonToolProps) => {
    const { fitToNext } = useViewManager();
    React.useEffect(() => {
      if (activated === true) {
        fitToNext();
      }
    }, [activated]);
    return <ContainerBtn>{buttonContent}</ContainerBtn>;
  },
  { className: 'next-view-button', independant: true, buttonTitle: 'Next View' }
);
