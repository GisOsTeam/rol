import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../tool/BaseButtonTool';
import { useDrawSource } from '../tool/hook/useDrawSource';
import { useDrawInteraction } from '../tool/hook/useDrawInteraction';
import GeometryType from 'ol/geom/GeometryType';

const ContainerBtn = styled.div``;

export const DrawLine = withBaseButtonTool((props: IBaseButtonToolProps) => {
  const drawSource = useDrawSource({
    layerUid: 'draw_line_layer_tool',
    persist: true,
    listable: true,
    snapshotable: true,
  });
  useDrawInteraction({
    activated: props.activated,
    type: GeometryType.LINE_STRING,
    source: drawSource,
  });
  return <ContainerBtn>Draw line</ContainerBtn>;
});
