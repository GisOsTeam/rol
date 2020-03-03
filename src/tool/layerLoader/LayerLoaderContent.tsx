import * as React from 'react';
import styled from 'styled-components';
import { Selector, ISelectorType } from '../common/Selector';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';

const Container = styled.div`
  margin: 2px;
`;

export interface ILayerLoaderContentProps extends IFunctionBaseWindowToolProps {
  selectorTypes: ISelectorType[];
}

export function LayerLoaderContent(props: ILayerLoaderContentProps) {
  return (
    <Container className={`${props.className}`}>
      <Selector selectorTypes={props.selectorTypes} />
    </Container>
  );
}
