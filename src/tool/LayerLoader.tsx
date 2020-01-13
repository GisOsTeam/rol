import * as React from 'react';
import { LayerLoaderButton } from './layerLoader/LayerLoaderButton';
import { LayerLoaderContent, ILayerLoaderContentProps } from './layerLoader/LayerLoaderContent';
import { LayerLoaderHeader } from './layerLoader/LayerLoaderHeader';
import { withBaseWindowTool, IBaseWindowToolProps } from './BaseWindowTool';
import { WmsLoader } from './common/WmsLoader';
import { ISelectorType } from './common/Selector';

export type ILayerLoaderProps = IBaseWindowToolProps & Partial<ILayerLoaderContentProps>;

export const DEFAULT_LAYER_LOADER_SELECTORS: ISelectorType[] = [
  { type: '.kml', description: 'KML (.kml)', showFileDropZone: true },
  { type: '.kmz', description: 'KMZ (.kmz)', showFileDropZone: true },
  { type: '.zip', description: 'Zipped Shapefile (.zip)', showFileDropZone: true },
  {
    type: 'WMS',
    description: 'Web Map Service',
    content: <WmsLoader gisProxyUrl="http://localhost:8181" />
  }
];
export const LayerLoader = withBaseWindowTool<ILayerLoaderProps>(
  LayerLoaderContent,
  LayerLoaderHeader,
  LayerLoaderButton,
  {
    className: 'layerLoader',
    selectors: DEFAULT_LAYER_LOADER_SELECTORS
  }
);
