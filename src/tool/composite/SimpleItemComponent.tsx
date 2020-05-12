import * as React from 'react';
import { IBaseUIItem } from './models/IBaseUIItem';

export interface ISimpleItem extends IBaseUIItem {
  displayedProp: string;
}

export const SimpleItemComponent = ({ displayedProp, item }: ISimpleItem) => {
  return <p>{item[displayedProp]}</p>;
};
