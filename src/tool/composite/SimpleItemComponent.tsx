import * as React from 'react'; 
export interface IItem {
    [k: string]: any;
}

export interface IItemComponentProps {
    item: IItem;

    displayedProp: string;
}

export const SimpleItemComponent: React.FunctionComponent<IItemComponentProps> = ({ displayedProp, item }: IItemComponentProps) => {
    console.log({ displayedProp, item });
    return <p>{item[displayedProp]}</p>;
} 