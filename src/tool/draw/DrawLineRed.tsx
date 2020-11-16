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
  strokeColor: 'rgb(255, 0, 0)',
  fillColor: 'rgb(255, 0, 0)',
  radius: 5,
  width: 5
});

const color = 'rgb(255, 0, 0)';
const style = new Style({
  fill: new Fill({
    color
  }),
  stroke: new Stroke({
    color,
    width: 5
  }),
});

export const DrawLineRed = withBaseButtonTool((props: IBaseButtonToolProps) => {
  const drawSource = useDrawSource({
    layerUid: 'PWET_draw_line_layer_tool_PWET',
    persist: true,
    name: 'Draw red Style',
    listable: true,
    snapshotable: true,
    styles
  });
  
  const { layersManager } = React.useContext(rolContext);

  React.useEffect(() => {
    const layer = layersManager.getLayerElementFromSource(drawSource)
    if (layer) {
      const olLayer = layer.olLayer as OlVector;
      if( olLayer && olLayer.getStyle ) {
        olLayer.setStyle(style);
      }
    }
  }, [drawSource]);

  const onDrawEnd = React.useCallback(() => console.log('Red drawEnd', drawSource), [drawSource]);
  useDrawInteraction({
    activated: props.activated,
    type: GeometryType.LINE_STRING,
    source: drawSource,
    onDrawEnd
  });
  return <ContainerBtn>{props.buttonContent || 'Draw Line Red'}</ContainerBtn>;
});
