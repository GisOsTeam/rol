import OlImageLayer from 'ol/layer/Image';
import { BaseLayer, IBaseLayerProps } from './BaseLayer';
import { Image as ImageSource } from '@gisosteam/aol/source/Image';
import { IInitSource } from '@gisosteam/aol/source/IExtended';

export interface IImageProps extends IBaseLayerProps {
  /**
   * Source.
   */
  source?: ImageSource;
}

export class Image extends BaseLayer<IImageProps, never, OlImageLayer<any>, ImageSource> {
  public createOlLayer(): OlImageLayer<any> {
    return new OlImageLayer();
  }

  public updateProps(prevProps: IImageProps, nextProps: IImageProps) {
    super.updateProps(prevProps, nextProps);
    if (prevProps == null || prevProps.source !== nextProps.source) {
      this.setSource(nextProps.source);
    }
  }

  public setSource(source: ImageSource) {
    if (source != null && 'init' in source) {
      (source as any as IInitSource).init().then(
        () => this.getOlLayer().setSource(source),
        () => this.getOlLayer().setSource(source)
      );
    } else {
      this.getOlLayer().setSource(source);
    }
  }
}
