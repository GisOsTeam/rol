import * as React from 'react';
import { rolContext } from '../../RolContext';
import Draw, { Options, DrawEvent } from 'ol/interaction/Draw';

export interface IUseDrawInteractionProps extends Options {
  /**
   * Callback on drawend
   */
  onDrawEnd?: (evt?: DrawEvent) => void;
  /**
   * Activated.
   */
  activated?: boolean;
}

export function useDrawInteraction(props: IUseDrawInteractionProps): Draw {
  const context = React.useContext(rolContext);
  const [draw, setDraw] = React.useState<Draw>(null);
  // Effect for build interaction
  React.useEffect(() => {
    const { activated, onDrawEnd, ...options } = props;
    const buildDrawInteraction = () => {
      const preCreateDraw = new Draw(options);
      if (onDrawEnd) {
        preCreateDraw.on('drawend', onDrawEnd);
      }
      preCreateDraw.setActive(activated);
      setDraw(preCreateDraw);
    };
    buildDrawInteraction();
    // Cleanup function
    return () => {
      if (draw != null && context.olMap != null) {
        context.olMap.removeInteraction(draw);
        setDraw(null);
      }
    };
  }, [
    props.type,
    props.clickTolerance,
    props.features,
    props.source,
    props.dragVertexDelay,
    props.snapTolerance,
    props.stopClick,
    props.maxPoints,
    props.minPoints,
    props.geometryName,
    props.freehand,
    props.wrapX,
  ]);
  // Effect for manage activate/deactivate
  React.useEffect(() => {
    if (draw != null) {
      if (context.olMap != null) {
        context.olMap.addInteraction(draw);
      }

      draw.setActive(props.activated === true);

      return () => {
        context.olMap.removeInteraction(draw);
      };
    }
  }, [props.activated, draw]);
  return draw;
}
