import * as React from 'react';
import { rolContext } from '../../RolContext';
import { LayersManager } from '../../LayersManager';

/**
 * @deprecated use useLayersManager
 */
export function useLayerManager(props: {} = {}): LayersManager {
  const context = React.useContext(rolContext);
  return context.layersManager;
}
