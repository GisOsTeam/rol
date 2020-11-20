import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, withBaseButtonTool } from '../BaseButtonTool';
import { useDrawInteraction } from '../hook/useDrawInteraction';
import { useDrawSource, IUseDrawSourceProps } from '../hook/useDrawSource';
import GeometryType from 'ol/geom/GeometryType';
import { createBox, DrawEvent } from 'ol/interaction/Draw';
import { useOlMap } from '../hook/useOlMap';

const ContainerBtn = styled.div`
  height: 28px;
`;

const drawSourceOpt: IUseDrawSourceProps = {
  layerUid: 'zoom-rectangle-widget-draw-source',
  persist: false,
  listable: false,
};

export interface IZoomRectangleWidgetProps extends IBaseButtonToolProps {
  buttonContent?: string | React.ReactElement;
}

const zoomRectangleFC = ({ activated = false, buttonContent = 'Zoom Rectangle' }: IZoomRectangleWidgetProps) => {
  const olMap = useOlMap();
  const source = useDrawSource(drawSourceOpt);

  const onDrawEnd = React.useCallback(
    (evt: DrawEvent) => {
      const onFitEnd = () => source.clear();

      evt.preventDefault();
      const { feature } = evt;
      olMap.getView().fit(feature.getGeometry().getExtent(), {
        callback: onFitEnd,
      });
    },
    [source, olMap]
  );

  const geometryFunction = React.useCallback(createBox(), []);

  useDrawInteraction({
    source,
    type: GeometryType.CIRCLE,
    geometryFunction,
    activated,
    onDrawEnd,
  });

  return <ContainerBtn>{buttonContent}</ContainerBtn>;
};

export const ZoomRectangleWidget = withBaseButtonTool(zoomRectangleFC, { className: 'counter-button', toggle: true });
