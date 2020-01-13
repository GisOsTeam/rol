import * as React from 'react';
import styled from 'styled-components';
import { Selector, ISelectorProps, ISelectorType } from '../common/Selector';
import { IBaseWindowToolProps, IFunctionBaseWindowToolProps } from '../BaseWindowTool';
const Container = styled.div`
  margin: 2px;
`;

export interface ILayerLoaderContentProps extends IFunctionBaseWindowToolProps {
  /**
   * Fixed GIS proxy url
   */
  gisProxyUrl?: string;

  selectorTypes: ISelectorType[];
}

export function LayerLoaderContent(props: ILayerLoaderContentProps) {
  return (
    <Container className={`${props.className}`}>
      <Selector selectorTypes={props.selectorTypes} />
    </Container>
  );
}
