import * as React from 'react';
import { withBaseTool } from './BaseTool';
import { CompositeToc, DraggableListAdaptator, LayerElementItem } from './composite';

export const Toc = withBaseTool(CompositeToc, {
  basemapsListComponent: DraggableListAdaptator,
  basemapsListComponentProps: {
    itemComponent: LayerElementItem,
    itemComponentProps: {
      inputProps: {
        type: 'radio',
        name: 'radiotoc',
      },
    },
  },
  overlaysListComponent: DraggableListAdaptator,
  overlaysListComponentProps: {
    itemComponent: LayerElementItem,
    itemComponentProps: {
      inputProps: {
        type: 'checkbox',
      },
    },
  },
});
