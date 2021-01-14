import { LayersPrefixEnum } from '@gisosteam/aol/source/IExtended';
import { LocalVector } from '@gisosteam/aol/source/LocalVector';
import { identify, IdentifyFilterType } from '@gisosteam/aol/source/query/identify';
import GeometryType from 'ol/geom/GeometryType';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import { DrawEvent } from 'ol/interaction/Draw';
import * as React from 'react';
import { rolContext } from '../../RolContext';
import { useDrawInteraction } from './useDrawInteraction';
import {
  getIIdentifyResponseFeaturesFromQueryResponse,
  IIdentifyResponseFeatures,
} from '../common/getIIdentifyResponseFeaturesFromQueryResponse';
import Geometry from 'ol/geom/Geometry';

export interface IIdentifyResponse {
  features: IIdentifyResponseFeatures;
  drawGeom: Geometry;
}

export interface IUseIdentifyProps {
  activated: boolean;
  /**
   * Pris en compte que sur les couches AGS
   */
  layersParam?: LayersPrefixEnum;
  limit?: number;
  tolerance?: number;
  filterSources?: IdentifyFilterType;
  typeGeom: GeometryType;
  drawSource: LocalVector;
  onIdentifyResponse: (identifyResp: IIdentifyResponse) => any;
}

/**
 * outil de dessin de geom (POINT, LIGNE, POLYGONE) + Identification des feats sur la carte qui intersectent cette geom
 */
export function useIdentify(props: IUseIdentifyProps): any {
  const drawSourceRef = React.useRef<LocalVector>(props.drawSource);
  const context = React.useContext(rolContext);
  const { olMap, layersManager } = context;

  /**
   * Lance l'identification à la fin de l'opération de dessin
   */
  const handleOnDrawEnd = async (evt: DrawEvent | undefined): Promise<any> => {
    if (evt) {
      let geom = null;
      if (props.typeGeom === GeometryType.POLYGON) {
        geom = evt.feature.getGeometry() as Polygon;
      } else if (props.typeGeom === GeometryType.POINT) {
        geom = evt.feature.getGeometry() as Point;
      } else if (props.typeGeom === GeometryType.LINE_STRING) {
        geom = evt.feature.getGeometry() as LineString;
      }
      if (geom) {
        const queryResponses = await identify(
          geom,
          olMap,
          props.limit,
          props.tolerance,
          props.filterSources,
          props.layersParam
        );
        if (props.onIdentifyResponse) {
          const features = getIIdentifyResponseFeaturesFromQueryResponse(queryResponses, layersManager);
          props.onIdentifyResponse({ features: features, drawGeom: geom });
        }
      }
    }
  };

  /**
   * supprime le dessin une fois qu'il est fini
   */
  const handleOnClickDblClickMap = (): void => {
    props.drawSource.clear();
  };

  useDrawInteraction({
    activated: props.activated,
    type: props.typeGeom,
    source: drawSourceRef.current,
    onDrawEnd: handleOnDrawEnd,
  });

  if (props.typeGeom === GeometryType.POLYGON || props.typeGeom === GeometryType.LINE_STRING) {
    if (props.activated) {
      olMap.on('dblclick', handleOnClickDblClickMap);
    } else {
      olMap.un('dblclick', handleOnClickDblClickMap);
    }
  } else if (props.typeGeom === GeometryType.POINT) {
    if (props.activated) {
      olMap.on('click', handleOnClickDblClickMap);
    } else {
      olMap.un('click', handleOnClickDblClickMap);
    }
  }
}