import * as React from 'react';
import styled from 'styled-components';
import { Selector, ISelectorType } from '../common/Selector';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';

const Container = styled.div`
  margin: 2px;
`;

export interface ILayerLoaderContentProps extends IFunctionBaseWindowToolProps {
  selectorTypes: ISelectorType[];
  showGisProxyUrlInput?: boolean;
  gisProxyUrl?: string;
}

export function LayerLoaderContent(props: ILayerLoaderContentProps) {
  for (const selectorType of props.selectorTypes) {
    if (selectorType.options == null) {
      selectorType.options = {};
    }
    selectorType.options.showGisProxyUrlInput = props.showGisProxyUrlInput;
    selectorType.options.gisProxyUrl = props.gisProxyUrl;
  }
  return (
    <Container className={`${props.className}`}>
      <Selector selectorTypes={props.selectorTypes} />
    </Container>
  );
}
