import * as React from 'react';
import { LayerLoaderButton } from './layerLoader/LayerLoaderButton';
import { LayerLoaderContent, ILayerLoaderContentProps } from './layerLoader/LayerLoaderContent';
import { LayerLoaderHeader } from './layerLoader/LayerLoaderHeader';
import { withBaseWindowTool, IBaseWindowToolProps } from './BaseWindowTool';
import { WmsLoader } from './common/WmsLoader';
import { ISelectorType, Selector, ISelectorProps } from './common/Selector';
import { KMZFileLoader, KMLFileLoader, ZipFileLoader } from './common/loaders/GenericLayerFileLoader';

export type ILayerLoaderProps = IBaseWindowToolProps & Partial<ILayerLoaderContentProps>;

export const DEFAULT_LAYER_LOADER_SELECTORS: ISelectorType[] = [
  {
    type: '.kml',
    description: 'KML (.kml)',
    content: KMLFileLoader
  },
  {
    type: '.kmz',
    description: 'KMZ (.kmz)',
    content: KMZFileLoader
  },
  {
    type: '.zip',
    description: 'Zipped Shapefile (.zip)',
    content: ZipFileLoader
  },
  {
    type: 'WMS',
    description: 'Web Map Service',
    options: {
      gisProxyUrl: 'http://localhost:8181'
    },
    content: WmsLoader
  }
];

export const LayerLoader = withBaseWindowTool<ILayerLoaderProps>(
  LayerLoaderContent,
  LayerLoaderHeader,
  LayerLoaderButton,
  {
    className: 'layerLoader',
    selectorTypes: DEFAULT_LAYER_LOADER_SELECTORS
  }
);
