import OlTileLayer from 'ol/layer/Tile';
import { BaseLayer, IBaseLayerProps } from './BaseLayer';
import { TimeImage as TileImageSource } from '@gisosteam/aol/source/TileImage';
import { IInitSource } from '@gisosteam/aol/source/IExtended';

export interface ITileProps extends IBaseLayerProps {
  /**
   * Source.
   */
  source?: TileImageSource;
}

export class Tile extends BaseLayer<ITileProps, never, OlTileLayer<any>, TileImageSource> {
  public createOlLayer(): OlTileLayer<any> {
    return new OlTileLayer();
  }

  public updateProps(prevProps: ITileProps, nextProps: ITileProps) {
    super.updateProps(prevProps, nextProps);
    if (prevProps == null || prevProps.source !== nextProps.source) {
      this.setSource(nextProps.source);
    }
  }

  public setSource(source: TileImageSource) {
    if (source != null && 'init' in source) {
      (source as any as IInitSource).init().then(
        () => this.getOlLayer().setSource(source),
        () => this.getOlLayer().setSource(source),
      );
    } else {
      this.getOlLayer().setSource(source);
    }
  }
}
