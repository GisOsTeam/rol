import * as React from 'react';

export interface IItemComponentProps<E> {
  item: E;
}

export interface ISimpleItemComponentProps extends IItemComponentProps<Record<string, any>> {
  displayedProp: string;
}

export const SimpleItemComponent = ({ displayedProp, item }: ISimpleItemComponentProps) => {
  return <p>{item[displayedProp]}</p>;
};
