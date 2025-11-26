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
  const selectorTypesUpd = [...props.selectorTypes];
  for (const selectorType of props.selectorTypes) {
    if (selectorType.options == null) {
      selectorTypesUpd.options = {};
    }
    selectorTypesUpd.options.showGisProxyUrlInput = props.showGisProxyUrlInput;
    selectorTypesUpd.options.gisProxyUrl = props.gisProxyUrl;
  }
  return (
    <Container className={`${props.className}`}>
      <Selector selectorTypes={selectorTypesUpd} />
    </Container>
  );
}
