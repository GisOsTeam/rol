import * as React from 'react';
import { rolContext } from '../../RolContext';
import OlMap from 'ol/Map';

export function useOlMap(props: {} = {}): OlMap {
  const context = React.useContext(rolContext);
  return context.olMap;
}
