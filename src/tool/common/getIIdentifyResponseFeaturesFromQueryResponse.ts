import { IQueryResponse, IQueryFeatureTypeResponse, IFeatureType } from '@gisosteam/aol/source/IExtended';
import { Feature } from 'ol';
import { LayersManager } from '../../LayersManager';
import { IBaseLayerProps } from '../../layer/BaseLayer';

export type IIdentifyResponseFeatures = {
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

export function getIIdentifyResponseFeaturesFromQueryResponse(
  queryResponses: IQueryResponse[],
  layersManager: LayersManager
): IIdentifyResponseFeatures {
  const identifyResponseFeatures: IIdentifyResponseFeatures = {};
  queryResponses.forEach((queryResponse: IQueryResponse) => {
    const { featureTypeResponses } = queryResponse;
    featureTypeResponses.forEach((ftResp: IQueryFeatureTypeResponse) => {
      if (ftResp.features.length > 0) {
        const type = ftResp.type ? `${ftResp.type.id}` : '-1';
        const layerElement = layersManager.getLayerElementFromSource(ftResp.source);
        const sourceUid = layerElement ? layerElement.uid : 'unknown';
        if (!identifyResponseFeatures[sourceUid]) {
          identifyResponseFeatures[sourceUid] = {
            layerProps: layerElement.reactElement.props,
            types: {},
          };
        }
        if (!identifyResponseFeatures[sourceUid].types[type]) {
          identifyResponseFeatures[sourceUid].types[type] = {
            type: ftResp.type,
            features: [],
          };
        }
        identifyResponseFeatures[sourceUid].types[type].features = ftResp.features;
      }
    });
  });
  return identifyResponseFeatures;
}
