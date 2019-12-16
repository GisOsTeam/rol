import * as React from 'react';
import { IBaseButtonToolProps, withBaseButtonTool } from '../tool';
import { useDrawInteraction } from '../tool/hook/useDrawInteraction';
import GeometryType from 'ol/geom/GeometryType';

export const DrawLine = withBaseButtonTool((props: IBaseButtonToolProps) => {
  const drawInteraction = useDrawInteraction({
    activated: props.activated,
    type: GeometryType.LINE_STRING,
    snapshotable: true
  });
  return <span>Draw line</span>;
});
