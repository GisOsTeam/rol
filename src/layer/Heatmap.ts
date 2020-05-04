import * as React from 'react';
import OlHeatmapLayer from 'ol/layer/Heatmap';
import { BaseLayer, IBaseLayerProps } from './BaseLayer';
import { Vector } from '@gisosteam/aol/source/Vector';

export interface IHeatmapProps extends IBaseLayerProps {
  /**
   * Source.
   */
  source: Vector;
  /**
   * Gradient.
   */
  gradient: string[];
  /**
   * Radius.
   */
  radius: number;
  /**
   * Blur.
   */
  blur: number;
  /**
   * Shadow.
   */
  shadow: number;
  /**
   * Weight.
   */
  weight: string;
  /**
   * Render mode.
   */
  renderMode: string;
}

export class Heatmap extends BaseLayer<IHeatmapProps, {}, OlHeatmapLayer, Vector> {
  public createOlLayer(): OlHeatmapLayer {
    return new OlHeatmapLayer();
  }

  public updateProps(prevProps: IHeatmapProps, nextProps: IHeatmapProps) {
    super.updateProps(prevProps, nextProps);
    if (prevProps == null || prevProps.source !== nextProps.source) {
      this.setSource(nextProps.source);
    }
  }

  public setSource(source: Vector) {
    if (source == null) {
      source = undefined;
    }
    source.init().then(
      () => this.getOlLayer().setSource(source),
      () => this.getOlLayer().setSource(source)
    );
  }

  public setGradient(gradient: string[]) {
    if (gradient == null) {
      gradient = undefined;
    }
    this.getOlLayer().setGradient(gradient);
  }

  public setRadius(radius: number) {
    if (radius == null) {
      radius = undefined;
    }
    this.getOlLayer().setRadius(radius);
  }

  public setBlur(blur: number) {
    if (blur == null) {
      blur = undefined;
    }
    this.getOlLayer().setBlur(blur);
  }
}
