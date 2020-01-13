import * as React from 'react';
import styled from 'styled-components';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';
import { useTranslate } from '../hook/useTranslate';

const Container = styled.div`
  width: 32px;
  height: 28px;
  &:after {
    content: 'ⓘ';
    font-weight: bold;
    vertical-align: middle;
  }
`;

export function IdentifyButton(props: IFunctionBaseWindowToolProps) {
  const translate = useTranslate();
  return <Container  title={translate('identify.header', 'Identify')} />;
}
