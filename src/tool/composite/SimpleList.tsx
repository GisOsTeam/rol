import * as React from 'react';
import { IItem, IItemComponentProps } from './SimpleItemComponent';



export interface IBaseListProps<T extends IItemComponentProps> {
    elements: IItem[];

    itemComponent: React.FunctionComponent<T> | React.ComponentClass<T, any> | string;

    itemComponentProps: T;
    uid: string;
}

export const SimpleList = ({ elements, itemComponent, itemComponentProps, uid }: IBaseListProps<IItemComponentProps>) => {
    console.log({ elements, uid, itemComponent });
    return <>{elements.map((item, index) => React.createElement(itemComponent, { ...itemComponentProps, item, key: `${uid}-${index}` }))}</>;
}