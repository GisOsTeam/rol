import * as React from 'react';
import OlTileLayer from 'ol/layer/Tile';
import { BaseLayer, IBaseLayerProps } from './BaseLayer';
import { TimeImage as TileImageSource } from '@gisosteam/aol/source/TileImage';

export interface ITileProps extends IBaseLayerProps {
  /**
   * Source.
   */
  source: TileImageSource;
}

export class Tile extends BaseLayer<ITileProps, {}, OlTileLayer, TileImageSource> {
  public createOlLayer(): OlTileLayer {
    return new OlTileLayer();
  }

  public updateProps(prevProps: ITileProps, nextProps: ITileProps) {
    super.updateProps(prevProps, nextProps);
    if (prevProps == null || prevProps.source !== nextProps.source) {
      this.setSource(nextProps.source);
    }
  }

  public setSource(source: TileImageSource) {
    if (source == null) {
      source = undefined;
    }
    source.init().then(() => this.getOlLayer().setSource(source), () => this.getOlLayer().setSource(source));
  }
}
