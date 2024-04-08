import OlWebGLTile from 'ol/layer/WebGLTile';
import { BaseLayer, IBaseLayerProps } from './BaseLayer';
import { GeoTIFF as TileImageSource } from '@gisosteam/aol/source/GeoTIFF';
import { IInitSource } from '@gisosteam/aol/source/IExtended';

export interface IWebGLTileProps extends IBaseLayerProps {
  /**
   * Source.d
   */
  source?: TileImageSource;
}

export class WebGLTile extends BaseLayer<IWebGLTileProps, never, OlWebGLTile, TileImageSource> {
  public createOlLayer(): OlWebGLTile {
    return new OlWebGLTile({});
  }

  public updateProps(prevProps: IWebGLTileProps, nextProps: IWebGLTileProps) {
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
