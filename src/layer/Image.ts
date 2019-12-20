import * as React from 'react';
import OlImageLayer from 'ol/layer/Image';
import { BaseLayer, IBaseLayerProps } from './BaseLayer';
import { IImage } from '@gisosteam/aol/source/IImage';

export interface IImageProps extends IBaseLayerProps {
  /**
   * Source.
   */
  source: IImage;
}

export class Image extends BaseLayer<IImageProps, {}, OlImageLayer, IImage> {
  public createOlLayer(): OlImageLayer {
    return new OlImageLayer();
  }

  public updateProps(prevProps: IImageProps, nextProps: IImageProps) {
    super.updateProps(prevProps, nextProps);
    if (prevProps == null || prevProps.source !== nextProps.source) {
      this.setSource(nextProps.source);
    }
  }

  public setSource(source: IImage) {
    if (source == null) {
      source = undefined;
    }
    this.getOlLayer().setSource(source);
  }
}
