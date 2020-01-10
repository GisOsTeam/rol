import * as React from 'react';
import { rolContext } from '../../RolContext';
import { LayersManager } from '../../LayersManager';

export function useLayerManager(props: {} = {}): LayersManager {
  const context = React.useContext(rolContext);
  return context.layersManager;
}
