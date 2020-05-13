import { IBaseUIItem } from './IBaseUIItem';

export interface IBaseUIList<T extends IBaseUIItem> {
  items: Array<Pick<T, 'item'>>;

  itemComponent: React.FunctionComponent<T> | React.ComponentClass<T>;

  itemComponentProps: T;
  uid: string;
}
