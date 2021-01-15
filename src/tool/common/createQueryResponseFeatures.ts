import { IQueryResponse, IQueryFeatureTypeResponse, IFeatureType } from '@gisosteam/aol/source/IExtended';
import { Feature } from 'ol';
import { LayersManager } from '../../LayersManager';
import { IBaseLayerProps } from '../../layer/BaseLayer';

export type IQueryResponseFeatures = {
  [sourceId: string]: {
    layerProps: IBaseLayerProps;
    types: {
      [typeId: string]: {
        type: IFeatureType<string | number>;
        features: Feature[];
      };
    };
  };
};

export function createQueryResponseFeatures(
  queryResponses: IQueryResponse[],
  layersManager: LayersManager
): IQueryResponseFeatures {
  const queryResponseFeatures: IQueryResponseFeatures = {};
  queryResponses.forEach((queryResponse: IQueryResponse) => {
    const { featureTypeResponses } = queryResponse;
    featureTypeResponses.forEach((ftResp: IQueryFeatureTypeResponse) => {
      if (ftResp.features != null && ftResp.features.length > 0) {
        const type = ftResp.type ? `${ftResp.type.id}` : '-1';
        const layerElement = layersManager.getLayerElementFromSource(ftResp.source);
        const sourceUid = layerElement ? layerElement.uid : 'unknown';
        if (!queryResponseFeatures[sourceUid]) {
          queryResponseFeatures[sourceUid] = {
            layerProps: layerElement.reactElement.props,
            types: {},
          };
        }
        if (!queryResponseFeatures[sourceUid].types[type]) {
          queryResponseFeatures[sourceUid].types[type] = {
            type: ftResp.type,
            features: [],
          };
        }
        queryResponseFeatures[sourceUid].types[type].features = ftResp.features;
      }
    });
  });
  return queryResponseFeatures;
}
