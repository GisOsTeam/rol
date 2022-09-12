import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../BaseButtonTool';
import { useDrawSource } from '../hook/useDrawSource';
import { useDrawInteraction } from '../hook/useDrawInteraction';

const ContainerBtn = styled.div``;

export const DrawLine = withBaseButtonTool((props: IBaseButtonToolProps) => {
  const drawSource = useDrawSource({
    layerUid: 'draw-line-tool-draw-source',
    snapshotable: true,
  });
  useDrawInteraction({
    activated: props.activated,
    type: 'LineString',
    source: drawSource,
  });
  return <ContainerBtn>{props.buttonContent || 'Draw Line'}</ContainerBtn>;
});
