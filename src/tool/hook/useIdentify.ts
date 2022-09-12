import { LayersPrefixEnum } from '@gisosteam/aol/source/IExtended';
import { LocalVector } from '@gisosteam/aol/source/LocalVector';
import { identify, IdentifyFilterType } from '@gisosteam/aol/source/query/identify';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import { DrawEvent } from 'ol/interaction/Draw';
import * as React from 'react';
import { rolContext } from '../../RolContext';
import { useDrawInteraction } from './useDrawInteraction';
import { createQueryResponseFeatures, IQueryResponseFeatures } from '../common/createQueryResponseFeatures';
import Geometry, { Type } from 'ol/geom/Geometry';

export interface IIdentifyResponse {
  features: IQueryResponseFeatures;
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
  typeGeom: Type;
  drawSource: LocalVector;
  onIdentifyResponse: (identifyResp: IIdentifyResponse) => any;
}

/**
 * outil de dessin de geom (POINT, LIGNE, POLYGONE, CIRCLE) + Identification des feats sur la carte qui intersectent cette geom
 */
export function useIdentify(props: IUseIdentifyProps): any {
  const context = React.useContext(rolContext);
  const { olMap, layersManager } = context;

  /**
   * Lance l'identification à la fin de l'opération de dessin
   */
  const handleOnDrawEnd = async (evt: DrawEvent | undefined): Promise<any> => {
    if (evt) {
      let geom = null;
      if (props.typeGeom === 'Polygon') {
        geom = evt.feature.getGeometry() as Polygon;
      } else if (props.typeGeom === 'Point') {
        geom = evt.feature.getGeometry() as Point;
      } else if (props.typeGeom === 'LineString') {
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
          const features = createQueryResponseFeatures(queryResponses, layersManager);
          props.onIdentifyResponse({ features: features, drawGeom: geom });
        }
      }
    }
  };

  /**
   * supprime le dessin une fois qu'il est fini
   */
  const handleOnClickDblClickMap = React.useCallback((): void => {
    props.drawSource.clear();
  }, [props.drawSource]);

  useDrawInteraction({
    activated: props.activated,
    type: props.typeGeom as any,
    source: props.drawSource,
    onDrawEnd: handleOnDrawEnd,
  });

  React.useEffect(() => {
    if (
      props.typeGeom === 'Polygon' ||
      props.typeGeom === 'LineString' ||
      props.typeGeom === 'Circle'
    ) {
      if (props.activated === true) {
        olMap.on('dblclick', handleOnClickDblClickMap);
      } else {
        olMap.un('dblclick', handleOnClickDblClickMap);
      }
    } else if (props.typeGeom === 'Point') {
      if (props.activated === true) {
        olMap.on('click', handleOnClickDblClickMap);
      } else {
        olMap.un('click', handleOnClickDblClickMap);
      }
    }
    return () => {
      olMap.un('dblclick', handleOnClickDblClickMap);
      olMap.un('click', handleOnClickDblClickMap);
    };
  }, [props.activated, props.typeGeom, handleOnClickDblClickMap]);
}
