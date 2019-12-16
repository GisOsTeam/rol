import * as React from 'react';
import { rolContext } from '../../RolContext';
import Draw from 'ol/interaction/Draw';
import GeometryType from 'ol/geom/GeometryType';
import { getDefaultLayerStyles } from '@gisosteam/aol/utils';
import { LocalVector } from '@gisosteam/aol/source';
import { LayerStyles } from '@gisosteam/aol/LayerStyles';

export interface IDrawInteractionProps {
  /**
   * Activated.
   */
  activated?: boolean;
  /**
   * Styles.
   */
  styles?: LayerStyles;
  /**
   * Type.
   */
  type: GeometryType;
}

export function useDrawInteraction(props: IDrawInteractionProps): Draw {
  const context = React.useContext(rolContext);
  const [draw, setDraw] = React.useState<Draw>(null);
  React.useEffect(() => {
    const buildDrawInteractionAndLayer = (type: GeometryType): Draw => {
      const layerProps = {
        uid: 'drawline_tool_layer',
        name: 'Line',
        layerStyles: props.styles != null ? props.styles : getDefaultLayerStyles()
      };
      const localVectorSource = context.layersManager.createAndAddLayerFromSourceDefinition(
        'LocalVector',
        {},
        layerProps
      ) as LocalVector;
      return new Draw({
        source: localVectorSource,
        type
      });
    };
    setDraw(buildDrawInteractionAndLayer(props.type));
    return () => {
      if (draw != null) {
        context.olMap.removeInteraction(draw);
      }
    };
  }, [props.type, props.styles]);
  React.useEffect(() => {
    if (props.activated === true) {
      if (draw != null) {
        context.olMap.addInteraction(draw);
      }
    } else {
      if (draw != null) {
        context.olMap.removeInteraction(draw);
      }
    }
  }, [props.activated]);
  return draw;
}
