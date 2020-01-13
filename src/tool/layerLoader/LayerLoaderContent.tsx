import * as React from 'react';
import styled from 'styled-components';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';
import { Selector, ISelectorType, IFileSelectorProps } from '../common/Selector';
const Container = styled.div`
  margin: 2px;
`;

export interface ILayerLoaderContentProps extends IFileSelectorProps {
  /**
   * Fixed GIS proxy url
   */
  gisProxyUrl?: string;
}

export function LayerLoaderContent(props: ILayerLoaderContentProps) {
  return (
    <Container className={`${props.className}`}>
      <Selector selectorsProps={{ gisProxyUrl: props.gisProxyUrl }} {...props} />
    </Container>
  );
}
