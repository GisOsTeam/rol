import * as React from 'react';
import { rolContext } from '../../RolContext';
import Draw from 'ol/interaction/Draw';
import GeometryType from 'ol/geom/GeometryType';
import { getDefaultLayerStyles, uid } from '@gisosteam/aol/utils';
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
   * Name.
   */
  name?: string;
  /**
   * Type.
   */
  type: GeometryType;
  /**
   * Snapshotable.
   */
  snapshotable?: boolean;
  /**
   * Listable.
   */
  listable?: boolean;
}

export function useDrawInteraction(props: IDrawInteractionProps): Draw {
  const context = React.useContext(rolContext);
  const [draw, setDraw] = React.useState<Draw>(null);
  const layerUid = 'drawinteraction_hook_layer';
  React.useEffect(() => {
    const buildDrawInteractionAndLayer = () => {
      const sourceOptions = {
        snapshotable: props.snapshotable === true,
        listable: props.listable === true
      };
      const layerProps = {
        uid: layerUid,
        name: props.name != null ? props.name : 'Draw',
        layerStyles: props.styles != null ? props.styles : getDefaultLayerStyles()
      };
      const localVectorSource = context.layersManager.createAndAddLayerFromSourceDefinition(
        'LocalVector',
        sourceOptions,
        layerProps
      ) as LocalVector;
      setDraw(
        new Draw({
          source: localVectorSource,
          type: props.type
        })
      );
    };
    buildDrawInteractionAndLayer();
    return () => {
      if (draw != null) {
        context.olMap.removeInteraction(draw);
      }
      context.layersManager.removeLayer(layerUid);
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
