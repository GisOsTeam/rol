import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../BaseButtonTool';
import { useDrawSource } from '../hook/useDrawSource';
import { useDrawInteraction } from '../hook/useDrawInteraction';
import GeometryType from 'ol/geom/GeometryType';
import { createLayerStyles } from '@gisosteam/aol/utils';
import { rolContext } from '../../RolContext';

const ContainerBtn = styled.div``;

const width = 5;

const styles = createLayerStyles({
  strokeColor: 'rgba(255, 0, 0, 0.7)',
  fillColor: 'rgba(255, 0, 0, 0.01)',
  radius: width / 2,
  width,
});

export const DrawLineRed = withBaseButtonTool((props: IBaseButtonToolProps) => {
  const drawSource = useDrawSource({
    layerUid: 'PWET_draw_line_layer_tool_PWET',
    persist: true,
    name: 'Draw red Style',
    listable: true,
    snapshotable: true,
    styles,
  });

  // const { layersManager } = React.useContext(rolContext);

  // React.useEffect(() => {
  //   const layer = layersManager.getLayerElementFromSource(drawSource);
  //   if (layer) {
  //     const olLayer = layer.olLayer as OlVector;
  //     if (olLayer && olLayer.getStyle) {
  //       olLayer.setStyle(style);
  //     }
  //   }
  // }, [drawSource]);

  const onDrawEnd = React.useCallback(() => console.log('Red drawEnd', drawSource), [drawSource]);
  useDrawInteraction({
    activated: props.activated,
    type: GeometryType.LINE_STRING,
    source: drawSource,
    onDrawEnd,
  });
  return <ContainerBtn>{props.buttonContent || 'Draw Line Red OlStyles'}</ContainerBtn>;
});
