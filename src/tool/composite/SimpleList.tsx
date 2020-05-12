import * as React from 'react';
import { IItemComponentProps } from './SimpleItemComponent';

export interface IBaseListProps<E, T extends IItemComponentProps<E>> {
  items: E[];

  itemComponent: React.FunctionComponent<T> | React.ComponentClass<T>;

  itemComponentProps: T;
  uid: string;
}

export function SimpleList<T extends IItemComponentProps<Record<string, any>>>({
  items,
  itemComponent,
  itemComponentProps,
  uid,
}: IBaseListProps<Record<string, any>, T>) {
  console.log({ items, uid, itemComponent });
  return (
    <>
      {items.map((item, index) =>
        React.createElement(itemComponent, { ...itemComponentProps, item, key: `${uid}-${index}` })
      )}
    </>
  );
}
