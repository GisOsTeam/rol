import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../BaseButtonTool';
import { useDrawSource } from '../hook/useDrawSource';
import { useDrawInteraction } from '../hook/useDrawInteraction';
import GeometryType from 'ol/geom/GeometryType';
import { createLayerStyles } from '@gisosteam/aol/utils';

const ContainerBtn = styled.div``;

const styles = createLayerStyles({
  strokeColor: 'rgba(0, 0, 255, 0.7)',
  fillColor: 'rgba(0, 0, 255, 0.01)',
  radius: 1,
  width: 1,
});

export const DrawLineBleu = withBaseButtonTool((props: IBaseButtonToolProps) => {
  const drawSource = useDrawSource({
    layerUid: 'draw_line_layer_tool_bleu',
    persist: true,
    name: 'Draw Bleu Style',
    listable: true,
    snapshotable: true,
    styles,
  });

  const onDrawEnd = React.useCallback(() => console.log('Bleu drawEnd', drawSource), [drawSource]);
  useDrawInteraction({
    activated: props.activated,
    type: GeometryType.POLYGON,
    source: drawSource,
    onDrawEnd,
  });
  return <ContainerBtn>{props.buttonContent || 'Draw Line Bleu'}</ContainerBtn>;
});
