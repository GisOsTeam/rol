import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../BaseButtonTool';
import { useViewManager } from '../hook/useViewManager';
import { useTranslate } from '../hook/useTranslate';

const ContainerBtn = styled.div`
  width: 32px;
  height: 28px;
  position: relative;
  &:after {
    content: '⤺';
    position: absolute;
    top: 6px;
    margin-left: -7px;
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
  { className: 'previous-view-button', toggle: false }
);
