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
    content: '⤻';
    position: absolute;
    top: 6px;
    margin-left: -7px;
  }
`;

export const NextViewButton = withBaseButtonTool(
  (props: IBaseButtonToolProps) => {
    const { fitToNext } = useViewManager();
    const translate = useTranslate();
    React.useEffect(() => {
      if (props.activated === true) {
        fitToNext();
      }
    }, [props.activated]);
    return <ContainerBtn title={translate('navigation.next', 'Next View')} />;
  },
  { className: 'next-view-button', toggle: false }
);
