import { IQueryResponse, IQueryFeatureTypeResponse } from '@gisosteam/aol/source/IExtended';
import { LayersManager } from '../../LayersManager';
import { IIdentifyResponseFeaturesByLayer } from '../hook';

export const getFeaturesBySourceByLayersFromQueryResponse = (
  queryResponses: IQueryResponse[],
  layersManager: LayersManager
): IIdentifyResponseFeaturesByLayer => {
  const features: IIdentifyResponseFeaturesByLayer = {};
  console.log(queryResponses);
  queryResponses.forEach((queryResponse: IQueryResponse) => {
    const { featureTypeResponses } = queryResponse;
    featureTypeResponses.forEach((ftResp: IQueryFeatureTypeResponse) => {
      if (ftResp.features.length > 0) {
        console.log(ftResp.features);
        const layerId = ftResp.type.id;
        const filtered = layersManager.getLayerElementFromSource(ftResp.source);
        const sourceUid = filtered ? filtered.uid : 'unknown';
        if (!features[sourceUid]) {
          features[sourceUid] = {};
        }
        if (!features[sourceUid][layerId]) {
          features[sourceUid][layerId] = [];
        }

        if (features[sourceUid]) features[sourceUid][layerId].push(...ftResp.features);
      }
    });
  });
  return features;
};
