import * as React from 'react';
import { LayerLoaderButton } from './layerLoader/LayerLoaderButton';
import { LayerLoaderContent } from './layerLoader/LayerLoaderContent';
import { LayerLoaderHeader } from './layerLoader/LayerLoaderHeader';
import { withBaseWindowTool, IBaseWindowToolProps } from './BaseWindowTool';

export interface ILayerLoaderProps extends IBaseWindowToolProps {
  /**
   * Fixed GIS proxy url
   */
  gisProxyUrl?: string;
}

export const LayerLoader = withBaseWindowTool<ILayerLoaderProps>(
  LayerLoaderContent,
  LayerLoaderHeader,
  LayerLoaderButton,
  {
    className: 'layerLoader'
  }
);
