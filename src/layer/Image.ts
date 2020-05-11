import * as React from 'react';
import OlImageLayer from 'ol/layer/Image';
import { BaseLayer, IBaseLayerProps } from './BaseLayer';
import { Image as ImageSource } from '@gisosteam/aol/source/Image';
import { IInitSource } from '@gisosteam/aol/source/IExtended';

export interface IImageProps extends IBaseLayerProps {
  /**
   * Source.
   */
  source: ImageSource;
}

export class Image extends BaseLayer<IImageProps, {}, OlImageLayer, ImageSource> {
  public createOlLayer(): OlImageLayer {
    return new OlImageLayer();
  }

  public updateProps(prevProps: IImageProps, nextProps: IImageProps) {
    super.updateProps(prevProps, nextProps);
    if (prevProps == null || prevProps.source !== nextProps.source) {
      this.setSource(nextProps.source);
    }
  }

  public setSource(source: ImageSource) {
    if (source == null) {
      source = undefined;
    }
    if ('init' in source) {
      (source as IInitSource).init().then(
        () => this.getOlLayer().setSource(source),
        () => this.getOlLayer().setSource(source)
      );
    } else {
      this.getOlLayer().setSource(source);
    }
  }
}
