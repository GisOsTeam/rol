import * as React from 'react';
import { rolContext } from '../../RolContext';
import { Translate } from '../../Translate';

export function useTranslate(): Translate {
  const context = React.useContext(rolContext);
  return context.translate;
}
