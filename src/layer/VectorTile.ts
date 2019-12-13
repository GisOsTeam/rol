import * as React from 'react';
import OlVectorTileLayer from 'ol/layer/VectorTile';
import { BaseLayer, IBaseLayerProps } from './BaseLayer';
import { IVectorTile } from '@gisosteam/aol/source';
import { LayerStyles } from '@gisosteam/aol/LayerStyles';
import { jsonEqual, applyLayerStyles } from '@gisosteam/aol/utils';

export interface IVectorTileProps extends IBaseLayerProps {
  /**
   * Source.
   */
  source: IVectorTile;
  /**
   * Layer styles.
   */
  layerStyles: LayerStyles;
}

export class VectorTile extends BaseLayer<IVectorTileProps, {}, OlVectorTileLayer, IVectorTile> {
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

  public setSource(source: IVectorTile) {
    if (source == null) {
      source = undefined;
    }
    this.getOlLayer().setSource(source);
  }

  public setLayerStyles(layerStyles: LayerStyles) {
    applyLayerStyles(this.getOlLayer(), layerStyles, this.props.uid);
  }
}
