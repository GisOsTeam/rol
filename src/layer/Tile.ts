import * as React from 'react';
import OlTileLayer from 'ol/layer/Tile';
import { BaseLayer, IBaseLayerProps } from './BaseLayer';
import { TimeImage as TileImageSource } from '@gisosteam/aol/source/TileImage';
import { IInitSource } from '@gisosteam/aol/source/IExtended';
import { TileJSON } from './TileJSON';

export interface ITileProps extends IBaseLayerProps {
  /**
   * Source.
   */
  source?: TileImageSource | TileJSON; //Posibilité de TileJSON à rajouter dans aol/src/source/TileImage
}

export class Tile extends BaseLayer<ITileProps, {}, OlTileLayer, TileImageSource | TileJSON> {
  public createOlLayer(): OlTileLayer {
    return new OlTileLayer();
  }

  public updateProps(prevProps: ITileProps, nextProps: ITileProps) {
    super.updateProps(prevProps, nextProps);
    if (prevProps == null || prevProps.source !== nextProps.source) {
      this.setSource(nextProps.source);
    }
  }

  public setSource(source: TileImageSource | TileJSON) {
    if (source != null && 'init' in source) {
      (source as IInitSource).init().then(
        () => this.getOlLayer().setSource(source),
        () => this.getOlLayer().setSource(source)
      );
    } else {
      this.getOlLayer().setSource(source);
    }
  }
}
