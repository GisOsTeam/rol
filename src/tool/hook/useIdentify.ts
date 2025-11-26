import { LayersPrefixEnum } from '@gisosteam/aol/source/IExtended';
import { LocalVector } from '@gisosteam/aol/source/LocalVector';
import { identify, IdentifyFilterType } from '@gisosteam/aol/source/query/identify';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import { DrawEvent } from 'ol/interaction/Draw';
import * as React from 'react';
import { useDrawInteraction } from './useDrawInteraction';
import { createQueryResponseFeatures, IQueryResponseFeatures } from '../common/createQueryResponseFeatures';
import Geometry, { Type } from 'ol/geom/Geometry';
import { LayerStyles } from '@gisosteam/aol';
import { useOlMap } from './useOlMap';
import { useLayersManager } from './useLayersManager';

export interface IIdentifyResponse {
  features: IQueryResponseFeatures;
  drawGeom: Geometry;
}

export interface IUseIdentifyProps {
  activated?: boolean;
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
  /**
   * Layer styles.
   */
  layerStyles?: LayerStyles;
}

/**
 * outil de dessin de geom (POINT, LIGNE, POLYGONE, CIRCLE) + Identification des feats sur la carte qui intersectent cette geom
 */
export function useIdentify(props: IUseIdentifyProps): any {
  const olMap = useOlMap();
  const layersManager = useLayersManager();

  /**
   * Lance l'identification à la fin de l'opération de dessin
   */
  const { typeGeom, limit, tolerance, filterSources, layersParam, onIdentifyResponse } = props;
  const handleOnDrawEnd = React.useCallback(
    async (evt: DrawEvent | undefined): Promise<any> => {
      if (evt) {
        let geom = null;
        if (typeGeom === 'Polygon') {
          geom = evt.feature.getGeometry() as Polygon;
        } else if (typeGeom === 'Point') {
          geom = evt.feature.getGeometry() as Point;
        } else if (typeGeom === 'LineString') {
          geom = evt.feature.getGeometry() as LineString;
        }
        if (geom) {
          const queryResponses = await identify(geom, olMap, limit, tolerance, filterSources, layersParam);
          if (onIdentifyResponse) {
            const features = createQueryResponseFeatures(queryResponses, layersManager);
            onIdentifyResponse({ features: features, drawGeom: geom });
          }
        }
      }
    },
    [typeGeom, olMap, limit, tolerance, filterSources, layersParam, onIdentifyResponse, layersManager],
  );

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
    layerStyles: props.layerStyles,
  });

  React.useEffect(() => {
    if (props.typeGeom === 'Polygon' || props.typeGeom === 'LineString' || props.typeGeom === 'Circle') {
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
  }, [props.activated, props.typeGeom, olMap, handleOnClickDblClickMap]);
}
