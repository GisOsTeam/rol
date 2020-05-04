import * as React from 'react';
import { rolContext } from '../../RolContext';

export function useViewManager() {
  const context = React.useContext(rolContext);
  const { fitToPrevious, fitToNext, fitToInitial } = context.viewManager;
  return { fitToPrevious, fitToNext, fitToInitial };
}
