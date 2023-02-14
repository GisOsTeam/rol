import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../BaseButtonTool';
import { useDrawSource } from '../hook/useDrawSource';
import { useDrawInteraction } from '../hook/useDrawInteraction';
import { LayerStyles } from '@gisosteam/aol';

const ContainerBtn = styled.div``;

export interface IDrawLineProps extends IBaseButtonToolProps {
  /**
   * Style.
   */
  styles?: LayerStyles;
}

export const DrawLine = withBaseButtonTool<IDrawLineProps>((props: IDrawLineProps) => {
  const drawSource = useDrawSource({
    layerUid: 'draw-line-tool-draw-source',
    snapshotable: true,
    styles: props.styles,
  });
  useDrawInteraction({
    activated: props.activated,
    type: 'LineString',
    source: drawSource,
  });
  return <ContainerBtn>{props.buttonContent || 'Draw Line'}</ContainerBtn>;
});
