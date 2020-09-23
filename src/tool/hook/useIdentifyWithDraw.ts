import { IQueryFeatureTypeResponse, IQueryResponse } from '@gisosteam/aol/source/IExtended';
import { LocalVector } from '@gisosteam/aol/source/LocalVector';
import { identify } from '@gisosteam/aol/source/query/identify';
import { Feature } from 'ol';
import { Coordinate } from 'ol/coordinate';
import GeometryType from 'ol/geom/GeometryType';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import { DrawEvent } from 'ol/interaction/Draw';
import * as React from 'react';
import { rolContext } from '../../RolContext';
import { useDrawInteraction } from './useDrawInteraction';
import { IIdentifyResponseFeatures } from '.';
import { getFeaturesBySourceFromQueryResponse } from '../common/getIIdentifyResponseFeaturesFromQueryResponse';

export interface IIdentifyWithDrawResponse {
  features: IIdentifyResponseFeatures;
  position: Coordinate | Coordinate[] | Coordinate[][];
}

export interface IUseIdentifyWithDrawProps {
  activated: boolean | undefined;
  tolerance?: number;
  limit?: number;
  typeGeom: GeometryType;
  layerDraw: LocalVector;
  onIdentifyResponse: (identifyResp: IIdentifyWithDrawResponse) => unknown;
}

/**
 * outil de dessin de geom (POINT, LIGNE, POLYGONE) + Identification des feats sur la carte qui intersectent cette geom
 */
export function useIdentifyWithDraw(props: IUseIdentifyWithDrawProps): any {
  const layerSelectionDraw = React.useRef<LocalVector>(props.layerDraw);
  const context = React.useContext(rolContext);
  const { olMap, layersManager } = context;

  /**
     * Lance l'identification à la fin de l'opération de dessin
     */
  const handleOnDrawEnd = async(evt: DrawEvent | undefined): Promise<any> => {
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
        const position = geom.getCoordinates();
        const queryResponses = await identify(geom, olMap, props.limit, props.tolerance);
        const features = getFeaturesBySourceFromQueryResponse(queryResponses, layersManager);
        props.onIdentifyResponse({ features: features, position: position });
      }
    }
  };

  /**
     * supprime le dessin une fois qu'il est est finis
     */
  const handleOndblCLickMap = (): void => {
    layerSelectionDraw.current.clear();
  };

  useDrawInteraction({
    activated: props.activated,
    type: props.typeGeom,
    source: layerSelectionDraw.current,
    onDrawEnd: handleOnDrawEnd
  });

  if (props.typeGeom === GeometryType.POLYGON || props.typeGeom === GeometryType.LINE_STRING) {
    if (props.activated) {
      olMap.on('dblclick', handleOndblCLickMap);
    } else {
      olMap.un('dblclick', handleOndblCLickMap);
    }
  } else if (props.typeGeom === GeometryType.POINT) {
    if (props.activated) {
      olMap.on('click', handleOndblCLickMap);
    } else {
      olMap.un('click', handleOndblCLickMap);
    }
  }
}
