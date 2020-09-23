import * as React from 'react';
import { rolContext } from '../../RolContext';
import Translate, { Options, TranslateEvent } from 'ol/interaction/Translate';
import { FeatureLike } from 'ol/Feature';
import Layer from 'ol/layer/Layer';
import Source from 'ol/source/Source';
import { LocalVector } from '@gisosteam/aol/source/LocalVector';
import { useLayersManager } from './useLayersManager';

export interface IUseTranslateInteractionProps {
  /**
   * Draw source.
   */
  source?: LocalVector;
  /**
   * Tolerance.
   */
  hitTolerance?: number;
  /**
   * Filter.
   */
  filter?: (p0: FeatureLike, p1: Layer<Source>) => boolean;
  /**
   * Callback on translateend.
   */
  onTranslateEnd?: (evt?: TranslateEvent) => void;
  /**
   * Activated.
   */
  activated?: boolean;
}

export function useTranslateInteraction(props: IUseTranslateInteractionProps): Translate {
  const context = React.useContext(rolContext);
  const layersManager = useLayersManager();
  const [translate, setTranslate] = React.useState<Translate>(null);
  const [added, setAdded] = React.useState<boolean>(false);
  // Effect for build interaction
  React.useEffect(() => {
    const buildTranslateInteraction = () => {
      if (props.source == null) {
        return;
      }
      const layerElement = layersManager.getLayerElementFromSource(props.source);
      if (layerElement == null || layerElement.olLayer == null) {
        return;
      }
      const preCreateTranslate = new Translate({
        layers: [layerElement.olLayer as Layer],
        hitTolerance: props.hitTolerance,
      });
      preCreateTranslate.setActive(props.activated);
      if (props.onTranslateEnd) {
        preCreateTranslate.on('translateend', props.onTranslateEnd);
      }
      setTranslate(preCreateTranslate);
    };
    buildTranslateInteraction();
    // Cleanup function
    return () => {
      if (translate != null && context.olMap != null) {
        context.olMap.removeInteraction(translate);
        setTranslate(null);
      }
    };
  }, [props.source, props.hitTolerance]);
  // Effect for manage activate/deactivate
  React.useEffect(() => {
    if (translate != null) {
      if (!added && context.olMap != null) {
        context.olMap.addInteraction(translate);
        setAdded(true);
      }
      translate.setActive(props.activated === true);
    }
  }, [props.activated]);
  return translate;
}
