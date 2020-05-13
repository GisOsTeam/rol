import * as React from 'react';
import DraggableList, { TemplateProps } from 'react-draggable-list';
import { ILayerElement } from '../../LayersManager';
import { rolContext } from '../../RolContext';
import { IBaseUIList } from './models/IBaseUIList';
import { IBaseUIItem } from './models';

type DraggableCompoProps<I> = React.Component<Partial<TemplateProps<I, void>>>;

export interface IDraggableListAdaptatorProps<C extends IBaseUIItem> extends IBaseUIList<C> {
  itemComponentProps: any;
}

export function DraggableListAdaptator<I, C extends IBaseUIItem, T extends DraggableCompoProps<I>>(
  props: IDraggableListAdaptatorProps<C>
) {
  const context = React.useContext(rolContext);
  const { items: elements, itemComponent, itemComponentProps } = props;

  const handleChange = (newList: ReadonlyArray<ILayerElement>) => {
    newList.forEach((layerElement, order) => {
      context.layersManager.updateLayerProps(layerElement.uid, { order });
    });
  };

  return (
    <DraggableList<I, void, T>
      {...itemComponentProps}
      itemKey="uid"
      list={elements}
      template={itemComponent as any}
      onMoveEnd={handleChange}
    />
  );
}
