import * as React from 'react';
import Draw, { Options, DrawEvent } from 'ol/interaction/Draw';
import { createLayerStyles, createStyleFunction, LayerStyles } from '@gisosteam/aol';
import { useOlMap } from './useOlMap';

export interface IUseDrawInteractionProps extends Options {
  /**
   * Callback on drawend
   */
  onDrawEnd?: (evt?: DrawEvent) => void;
  /**
   * Activated.
   */
  activated?: boolean;
  /**
   * Layer styles.
   */
  layerStyles?: LayerStyles;
}

export function useDrawInteraction(props: IUseDrawInteractionProps): Draw {
  const olMap = useOlMap();
  const [draw, setDraw] = React.useState<Draw>(null);
  // Effect for build interaction
  const { activated, onDrawEnd, layerStyles, ...options } = props;
  React.useEffect(() => {
    const buildDrawInteraction = () => {
      const style = createStyleFunction(layerStyles != null ? layerStyles : createLayerStyles());
      const preCreateDraw = new Draw({ ...options, style });
      if (onDrawEnd) {
        preCreateDraw.on('drawend', onDrawEnd);
      }
      preCreateDraw.setActive(activated);
      setDraw(preCreateDraw);
    };
    buildDrawInteraction();
    // Cleanup function
    return () => {
      if (draw != null && olMap != null) {
        olMap.removeInteraction(draw);
        setDraw(null);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activated, layerStyles, olMap, onDrawEnd]);
  // Effect for manage activate/deactivate
  React.useEffect(() => {
    if (draw != null) {
      if (olMap != null) {
        olMap.addInteraction(draw);
      }

      draw.setActive(props.activated === true);

      return () => {
        olMap.removeInteraction(draw);
      };
    }
  }, [props.activated, olMap, draw]);
  return draw;
}
