import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../BaseButtonTool';
import { useViewManager } from '../hook/useViewManager';
import { useTranslate } from '../hook/useTranslate';

const ContainerBtn = styled.div`
  &:after {
    content: '🌍';
  }
`;

export const InitialViewButton = withBaseButtonTool(
  (props: IBaseButtonToolProps) => {
    const { fitToInitial } = useViewManager();
    const translate = useTranslate();
    React.useEffect(() => {
      console.log('Use effect', props);
      if (props.activated === true) {
        fitToInitial();
      }
    }, [props.activated]);
    return <ContainerBtn title={translate('navigation.initial', 'Initial View')} />;
  },
  { className: 'initial-view-button', independant: true }
);
