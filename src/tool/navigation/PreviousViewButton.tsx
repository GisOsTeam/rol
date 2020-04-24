import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../BaseButtonTool';
import { useViewManager } from '../hook/useViewManager';
import { useTranslate } from '../hook/useTranslate';

const ContainerBtn = styled.div`
  width: 32px;
  height: 28px;
  &:after {
    content: '⤺';
    font-weight: bold;
    vertical-align: middle;
  }
`;

export const PreviousViewButton = withBaseButtonTool(
  (props: IBaseButtonToolProps) => {
    const { fitToPrevious } = useViewManager();
    const translate = useTranslate();
    React.useEffect(() => {
      if (props.activated === true) {
        fitToPrevious();
      }
    }, [props.activated]);
    return <ContainerBtn title={translate('navigation.previous', 'Previous View')} />;
  },
  { className: 'counter-button', toggle: false }
);
