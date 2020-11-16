import * as React from 'react';
import OlVectorTileLayer from 'ol/layer/VectorTile';
import { BaseLayer, IBaseLayerProps } from './BaseLayer';
import { VectorTile as VectorTileSource } from '@gisosteam/aol/source/VectorTile';
import { LayerStyles } from '@gisosteam/aol/LayerStyles';
import { jsonEqual, applyLayerStyles } from '@gisosteam/aol/utils';
import { IInitSource } from '@gisosteam/aol/source/IExtended';
import { layerStylesToOlStyle } from '../utils';

export interface IVectorTileProps extends IBaseLayerProps {
  /**
   * Source.
   */
  source: VectorTileSource;
  /**
   * Layer styles.
   */
  layerStyles: LayerStyles;
}

export class VectorTile extends BaseLayer<IVectorTileProps, {}, OlVectorTileLayer, VectorTileSource> {
  public createOlLayer(): OlVectorTileLayer {
    return new OlVectorTileLayer();
  }

  public updateProps(prevProps: IVectorTileProps, nextProps: IVectorTileProps) {
    super.updateProps(prevProps, nextProps);
    if (prevProps == null || prevProps.source !== nextProps.source) {
      this.setSource(nextProps.source);
    }
    if (prevProps == null || !jsonEqual(prevProps.layerStyles, nextProps.layerStyles)) {
      this.setLayerStyles(nextProps.layerStyles);
    }
  }

  public setSource(source: VectorTileSource) {
    if (source != null && 'init' in source) {
      (source as IInitSource).init().then(
        () => this.getOlLayer().setSource(source),
        () => this.getOlLayer().setSource(source)
      );
    } else {
      this.getOlLayer().setSource(source);
    }
  }

  /**
   * applyLayerStyles s'embrouille, du coup on passe par les styles classiques
   *
   **/
  public setLayerStyles(layerStyles: LayerStyles) {
    this.getOlLayer().setStyle(layerStylesToOlStyle(layerStyles));
    // applyLayerStyles(this.getOlLayer(), layerStyles, this.props.uid);
  }
}
