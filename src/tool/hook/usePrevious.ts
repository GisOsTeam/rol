import * as React from 'react';

/**
 * Hook pour récupérer la valeur d'une varaible à l'état précédent
 * @param value, la variable à suivre
 */
export function usePrevious(value: any) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
