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
  const [added, setAdded] = React.useState<boolean>(false);
  // Effect for build interaction
  React.useEffect(() => {
    const buildDrawInteraction = () => {
      const preCreateDraw = new Draw(props);
      if (props.onDrawEnd) {
        preCreateDraw.on('drawend', props.onDrawEnd);
      }
      preCreateDraw.setActive(props.activated);
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
  }, [props.source, props.type]);
  // Effect for manage activate/deactivate
  React.useEffect(() => {
    if (draw != null) {
      if (!added && context.olMap != null) {
        context.olMap.addInteraction(draw);
        setAdded(true);
      }
      draw.setActive(props.activated === true);
    }
  }, [props.activated]);
  return draw;
}
