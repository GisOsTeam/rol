import * as React from 'react';
import { IBaseButtonToolProps, withBaseButtonTool } from '../tool';
import { useDrawSource } from '../tool/hook/useDrawSource';
import { useDrawInteraction  } from '../tool/hook/useDrawInteraction';
import GeometryType from 'ol/geom/GeometryType';

export const DrawLine = withBaseButtonTool((props: IBaseButtonToolProps) => {
  const drawSource = useDrawSource({
    layerUid: 'draw_line_layer_tool',
    persist: true,
    listable: true,
    snapshotable: true
  });
  const drawInteraction = useDrawInteraction({
    activated: props.activated,
    type: GeometryType.LINE_STRING,
    source: drawSource
  });
  return <span>Draw line</span>;
});
