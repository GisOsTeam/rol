import OlVectorLayer from 'ol/layer/Vector';
import { BaseLayer, IBaseLayerProps } from './BaseLayer';
import { Vector as VectorSource } from '@gisosteam/aol/source/Vector';
import { LayerStyles } from '@gisosteam/aol/LayerStyles';
import { jsonEqual } from '@gisosteam/aol/utils';
import { applyLayerStyles } from '@gisosteam/aol/LayerStyles';
import { IInitSource } from '@gisosteam/aol/source/IExtended';

export interface IVectorProps extends IBaseLayerProps {
  /**
   * Source.
   */
  source?: VectorSource;
  /**
   * Layer styles.
   */
  layerStyles?: LayerStyles;
}

export class Vector extends BaseLayer<IVectorProps, never, OlVectorLayer<any>, VectorSource> {
  public createOlLayer(): OlVectorLayer<any> {
    return new OlVectorLayer();
  }

  public updateProps(prevProps: IVectorProps, nextProps: IVectorProps) {
    super.updateProps(prevProps, nextProps);
    if (prevProps == null || prevProps.source !== nextProps.source) {
      this.setSource(nextProps.source);
    }
    if (prevProps == null || !jsonEqual(prevProps.layerStyles, nextProps.layerStyles)) {
      this.setLayerStyles(nextProps.layerStyles);
    }
  }

  public setSource(source: VectorSource) {
    if (source != null && 'init' in source) {
      (source as any as IInitSource).init().then(
        () => this.getOlLayer().setSource(source),
        () => this.getOlLayer().setSource(source),
      );
    } else {
      this.getOlLayer().setSource(source);
    }
  }

  public setLayerStyles(layerStyles: LayerStyles) {
    applyLayerStyles(this.getOlLayer(), layerStyles);
  }
}
