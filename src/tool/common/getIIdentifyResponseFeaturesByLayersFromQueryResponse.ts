import { IQueryResponse, IQueryFeatureTypeResponse } from '@gisosteam/aol/source/IExtended';
import { LayersManager } from '../../LayersManager';
import { IIdentifyResponseFeaturesByLayer } from '../hook';

export const getFeaturesBySourceByLayersFromQueryResponse = (
  queryResponses: IQueryResponse[],
  layersManager: LayersManager
): IIdentifyResponseFeaturesByLayer => {
  const features: IIdentifyResponseFeaturesByLayer = {};
  queryResponses.forEach((queryResponse: IQueryResponse) => {
    const { featureTypeResponses } = queryResponse;
    featureTypeResponses.forEach((ftResp: IQueryFeatureTypeResponse) => {
      if (ftResp.features.length > 0) {
        const layerId = ftResp.type ? ftResp.type.id : -1;
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
