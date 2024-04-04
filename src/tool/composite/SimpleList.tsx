import * as React from 'react';
import { IBaseUIItem, IBaseUIList } from './models';

export function SimpleList<T extends IBaseUIItem>({ items, itemComponent, itemComponentProps, uid }: IBaseUIList<T>) {
  return (
    <>
      {items.map((item, index) =>
        React.createElement(itemComponent, { ...itemComponentProps, item, key: `${uid}-${index}` }),
      )}
    </>
  );
}
