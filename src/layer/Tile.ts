import * as React from 'react';
import OlTileLayer from 'ol/layer/Tile';
import { BaseLayer, IBaseLayerProps } from './BaseLayer';
import { ITileImage } from '@gisosteam/aol/source';

export interface ITileProps extends IBaseLayerProps {
  /**
   * Source.
   */
  source: ITileImage;
}

export class Tile extends BaseLayer<ITileProps, {}, OlTileLayer, ITileImage> {
  public createOlLayer(): OlTileLayer {
    return new OlTileLayer();
  }

  public updateProps(prevProps: ITileProps, nextProps: ITileProps) {
    super.updateProps(prevProps, nextProps);
    if (prevProps == null || prevProps.source !== nextProps.source) {
      this.setSource(nextProps.source);
    }
  }

  public setSource(source: ITileImage) {
    if (source == null) {
      source = undefined;
    }
    this.getOlLayer().setSource(source);
  }
}
