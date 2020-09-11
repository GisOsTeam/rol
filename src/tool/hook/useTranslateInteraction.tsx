import * as React from 'react';
import { rolContext } from '../../RolContext';
import Translate, { Options, TranslateEvent } from 'ol/interaction/Translate';
import { FeatureLike } from 'ol/Feature';
import Layer from 'ol/layer/Layer';
import Source from 'ol/source/Source';
import { LocalVector } from '@gisosteam/aol/source/LocalVector';
import { useLayerManager } from './useLayerManager';

export interface IUseuseTranslateInteractionProps {
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

export function useTranslateInteraction(props: IUseuseTranslateInteractionProps): Translate {
  const context = React.useContext(rolContext);
  const layerManager = useLayerManager();
  const [translate, setTranslate] = React.useState<Translate>(null);
  // Effect for build interaction
  React.useEffect(() => {
    const buildTranslateInteraction = () => {
      if (props.source == null) {
        return;
      }
      const layerElement = layerManager.getLayerElementFromSource(props.source);
      if (layerElement == null || layerElement.olLayer == null) {
        return;
      }
      const preCreateTranslate = new Translate({
        layers: [layerElement.olLayer as Layer],
        hitTolerance: props.hitTolerance,
      });

      if (props.onTranslateEnd) {
        preCreateTranslate.on('translateend', props.onTranslateEnd);
      }

      setTranslate(preCreateTranslate);
    };

    buildTranslateInteraction();
    // Cleanup function
    return () => {
      if (translate != null) {
        console.log('clear TranslateInteraction');
        context.olMap.removeInteraction(translate);
        setTranslate(null);
      }
    };
  }, [props.source, props.hitTolerance]);
  // Effect for manage activate/deactivate
  React.useEffect(() => {
    if (props.activated === true) {
      if (translate != null) {
        context.olMap.addInteraction(translate);
      }
    } else {
      if (translate != null) {
        context.olMap.removeInteraction(translate);
      }
    }
  }, [props.activated]);
  return translate;
}
