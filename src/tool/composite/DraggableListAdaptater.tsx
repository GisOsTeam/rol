import * as React from 'react';
import { IBaseListProps } from './SimpleList';
import { IItemComponentProps } from './SimpleItemComponent';
import DraggableList, { TemplateProps } from 'react-draggable-list';
import { ILayerElement } from '../../LayersManager';
import { LayerElementItem } from './LayerElementItem';

type DraggableCompoProps<I> = React.Component<Partial<TemplateProps<I, void>>>;
type pwet<I, C extends IItemComponentProps<I>, T extends DraggableCompoProps<I>> = IBaseListProps<I, C>;

export interface IDraggableListAdaptatorProps<I, C extends IItemComponentProps<I>, T extends DraggableCompoProps<I>>
  extends pwet<I, C, T> {
  itemComponentProps: any;
}

export function DraggableListAdaptator<I, C extends IItemComponentProps<I>, T extends DraggableCompoProps<I>>(
  props: IDraggableListAdaptatorProps<I, C, T>
) {
  const { items: elements, itemComponent, itemComponentProps } = props;
  return (
    <DraggableList<I, void, T> {...itemComponentProps} itemKey="uid" list={elements} template={itemComponent as any} />
  );
}
