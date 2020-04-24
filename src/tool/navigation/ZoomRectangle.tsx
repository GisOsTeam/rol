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
  listable: false
};

export const ZoomRectangleWidget = withBaseButtonTool(
  (props: IBaseButtonToolProps) => {
    const olMap = useOlMap();
    const source = useDrawSource(drawSourceOpt);

    const onFitEnd = () => {
      source.clear();
    };

    const onDrawEnd = (evt: DrawEvent) => {
      evt.preventDefault();
      const { feature } = evt;
      olMap.getView().fit(feature.getGeometry().getExtent(), {
        callback: onFitEnd
      });
    };

    useDrawInteraction({
      source,
      type: GeometryType.CIRCLE,
      geometryFunction: createBox(),
      activated: props.activated,
      onDrawEnd
    });
    return <ContainerBtn>Zoom Rect</ContainerBtn>;
  },
  { className: 'counter-button', toggle: true }
);
