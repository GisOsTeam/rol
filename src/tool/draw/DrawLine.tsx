import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../BaseButtonTool';
import { useDrawSource } from '../hook/useDrawSource';
import { useDrawInteraction } from '../hook/useDrawInteraction';
import GeometryType from 'ol/geom/GeometryType';
import { createLayerStyles } from '@gisosteam/aol/utils';

const ContainerBtn = styled.div``;

export const DrawLine = withBaseButtonTool((props: IBaseButtonToolProps) => {
  const drawSource = useDrawSource({
    layerUid: 'draw_line_layer_tool',
    persist: true,
    listable: true,
    snapshotable: true,
    name: "Draw vert",
    styles: createLayerStyles({
      strokeColor: 'rgb(0, 255, 0)',
      fillColor: 'rgb(0, 255, 0)',
      radius: 5,
      width: 5
    })
  });

  React.useEffect(() => console.log('Vert', drawSource), [props.activated]);
  const onDrawEnd = React.useCallback(() => console.log("DrawEnd Vert", drawSource), [drawSource]);
  useDrawInteraction({
    activated: props.activated,
    type: GeometryType.LINE_STRING,
    source: drawSource,
    onDrawEnd
  });
  return <ContainerBtn>{props.buttonContent || 'Draw Line'}</ContainerBtn>;
});
