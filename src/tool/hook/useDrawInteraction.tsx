import * as React from 'react';
import { rolContext } from '../../RolContext';
import Draw from 'ol/interaction/Draw';
import GeometryType from 'ol/geom/GeometryType';
import { LocalVector } from '@gisosteam/aol/source/LocalVector';

export interface IUseDrawInteractionProps {
  /**
   * Draw source.
   */
  source: LocalVector;
  /**
   * Type.
   */
  type: GeometryType;
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
    const buildDrawInteraction = () => {
      setDraw(
        new Draw({
          source: props.source,
          type: props.type
        })
      );
    };
    buildDrawInteraction();
    // Cleanup function
    return () => {
      if (draw != null) {
        context.olMap.removeInteraction(draw);
        setDraw(null);
      }
    };
  }, [props.source, props.type]);
  // Effect for manage activate/deactivate
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
