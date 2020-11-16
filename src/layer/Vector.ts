import * as React from 'react';
import OlVectorLayer from 'ol/layer/Vector';
import { BaseLayer, IBaseLayerProps } from './BaseLayer';
import { Vector as VectorSource } from '@gisosteam/aol/source/Vector';
import { LayerStyles } from '@gisosteam/aol/LayerStyles';
import { jsonEqual, applyLayerStyles } from '@gisosteam/aol/utils';
import { IInitSource } from '@gisosteam/aol/source/IExtended';
import { layerStylesToOlStyle } from '../utils';

export interface IVectorProps extends IBaseLayerProps {
  /**
   * Source.
   */
  source?: VectorSource;
  /**
   * Layer styles.
   */
  layerStyles?: LayerStyles;
}

export class Vector extends BaseLayer<IVectorProps, {}, OlVectorLayer, VectorSource> {
  public createOlLayer(): OlVectorLayer {
    return new OlVectorLayer();
  }

  public updateProps(prevProps: IVectorProps, nextProps: IVectorProps) {
    super.updateProps(prevProps, nextProps);
    if (prevProps == null || prevProps.source !== nextProps.source) {
      this.setSource(nextProps.source);
    }
    if (prevProps == null || !jsonEqual(prevProps.layerStyles, nextProps.layerStyles)) {
      this.setLayerStyles(nextProps.layerStyles);
    }
  }

  public setSource(source: VectorSource) {
    if (source != null && 'init' in source) {
      (source as IInitSource).init().then(
        () => this.getOlLayer().setSource(source),
        () => this.getOlLayer().setSource(source)
      );
    } else {
      this.getOlLayer().setSource(source);
    }
  }

  // applyLayerStyles s'embrouille, du coup on passe par les styles classiques
  public setLayerStyles(layerStyles: LayerStyles) {
    this.getOlLayer().setStyle(layerStylesToOlStyle(layerStyles));
    // applyLayerStyles(this.getOlLayer(), layerStyles, this.props.uid);
  }
}
