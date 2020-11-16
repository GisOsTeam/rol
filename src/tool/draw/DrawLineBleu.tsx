import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../BaseButtonTool';
import { useDrawSource } from '../hook/useDrawSource';
import { useDrawInteraction } from '../hook/useDrawInteraction';
import GeometryType from 'ol/geom/GeometryType';
import { applyLayerStyles, createLayerStyles } from '@gisosteam/aol/utils';
import { SourceTypeEnum } from '@gisosteam/aol/source/types';
import { rolContext } from '../../RolContext';
import OlVector from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

const ContainerBtn = styled.div``;

const styles = createLayerStyles({
  strokeColor: 'rgb(0, 0, 255)',
  fillColor: 'rgb(0, 0, 255)',
  radius: 5,
  width: 5,
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
    type: GeometryType.LINE_STRING,
    source: drawSource,
    onDrawEnd,
  });
  return <ContainerBtn>{props.buttonContent || 'Draw Line Bleu'}</ContainerBtn>;
});
