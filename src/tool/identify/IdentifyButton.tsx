import * as React from 'react';
import styled from 'styled-components';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';
import { useTranslate } from '../hook/useTranslate';

const Container = styled.div`
  &:after {
    content: 'ⓘ';
    font-weight: bold;
  }
`;

export function IdentifyButton(props: IFunctionBaseWindowToolProps) {
  const translate = useTranslate();
  return <Container title={translate('identify.header', 'Identify')} />;
}
