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
    content: '🌍';
    position: absolute;
    top: 6px;
    margin-left: -7px;
  }
`;

// content: 'Init';
// font-weight: bold;
// vertical-align: middle;
// display: block;
// width: 100%;
// text-align: center;

export const InitialViewButton = withBaseButtonTool(
  (props: IBaseButtonToolProps) => {
    const { fitToInitial } = useViewManager();
    const translate = useTranslate();
    React.useEffect(() => {
      if (props.activated === true) {
        fitToInitial();
      }
    }, [props.activated]);
    return <ContainerBtn title={translate('navigation.initial', 'Initial View')} />;
  },
  { className: 'initial-view-button', toggle: false }
);
