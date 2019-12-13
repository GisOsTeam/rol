import * as React from 'react';
import OlVectorLayer from 'ol/layer/Vector';
import { BaseLayer, IBaseLayerProps } from './BaseLayer';
import { IVector } from '@gisosteam/aol/source';
import { LayerStyles } from '@gisosteam/aol/LayerStyles';
import { jsonEqual, applyLayerStyles } from '@gisosteam/aol/utils';

export interface IVectorProps extends IBaseLayerProps {
  /**
   * Source.
   */
  source: IVector;
  /**
   * Layer styles.
   */
  layerStyles: LayerStyles;
}

export class Vector extends BaseLayer<IVectorProps, {}, OlVectorLayer, IVector> {
  public createOlLayer(): OlVectorLayer {
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

  public setSource(source: IVector) {
    if (source == null) {
      source = undefined;
    }
    this.getOlLayer().setSource(source);
  }

  public setLayerStyles(layerStyles: LayerStyles) {
    applyLayerStyles(this.getOlLayer(), layerStyles, this.props.uid);
  }
}
