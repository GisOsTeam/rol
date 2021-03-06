import * as React from 'react';
import OlVectorTileLayer from 'ol/layer/VectorTile';
import { BaseLayer, IBaseLayerProps } from './BaseLayer';
import { VectorTile as VectorTileSource } from '@gisosteam/aol/source/VectorTile';
import { LayerStyles } from '@gisosteam/aol/LayerStyles';
import { jsonEqual, applyLayerStyles } from '@gisosteam/aol/utils';
import { IInitSource } from '@gisosteam/aol/source/IExtended';
import VectorTileRenderType from 'ol/layer/VectorTileRenderType';

export interface IVectorTileProps extends IBaseLayerProps {
  /**
   * Source.
   */
  source: VectorTileSource;
  /**
   * Layer styles.
   */
  layerStyles?: LayerStyles;
  /**
   * Render buffer.
   */
  renderBuffer?: number;
  /**
   * Render mode.
   */
  renderMode?: VectorTileRenderType;
  /**
   * Declutter.
   */
  declutter?: boolean;
}

export class VectorTile extends BaseLayer<IVectorTileProps, {}, OlVectorTileLayer, VectorTileSource> {
  public createOlLayer(): OlVectorTileLayer {
    return new OlVectorTileLayer({
      renderBuffer: this.props.renderBuffer,
      renderMode: this.props.renderMode,
      declutter: this.props.declutter,
    });
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
      (source as any as IInitSource).init().then(
        () => this.getOlLayer().setSource(source),
        () => this.getOlLayer().setSource(source)
      );
    } else {
      this.getOlLayer().setSource(source);
    }
  }

  public setLayerStyles(layerStyles: LayerStyles) {
    applyLayerStyles(this.getOlLayer(), layerStyles, this.props.uid);
  }
}
