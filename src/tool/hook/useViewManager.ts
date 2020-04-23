import * as React from 'react';
import { useOlMap } from './useOlMap';
import { MapEvent, PluggableMap } from 'ol';
import { Coordinate } from 'ol/coordinate';
import { Extent, equals } from 'ol/extent';
import { rolContext } from '../../RolContext';

export function useViewManager() {
  const context = React.useContext(rolContext);
  const { fitToPrevious, fitToNext } = context.viewManager;
  return { fitToPrevious, fitToNext };
}
