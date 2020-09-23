import { IQueryResponse, IQueryFeatureTypeResponse } from '@gisosteam/aol/source/IExtended';
import { LayersManager } from '../../LayersManager';
import { IIdentifyResponseFeatures } from '../hook';

export const getFeaturesBySourceFromQueryResponse = (
  queryResponses: IQueryResponse[],
  layersManager: LayersManager
): IIdentifyResponseFeatures => {
  const features: any = {};
  queryResponses.forEach((queryResponse: IQueryResponse) => {
    const { featureTypeResponses } = queryResponse;
    featureTypeResponses.forEach((ftResp: IQueryFeatureTypeResponse) => {
      if (ftResp.features.length > 0) {
        const filtered = layersManager.getLayerElementFromSource(ftResp.source);
        const sourceUid = filtered ? filtered.uid : 'unknown';
        if (!features[sourceUid]) {
          features[sourceUid] = [];
        }
        features[sourceUid].push(...ftResp.features);
      }
    });
  });
  return features;
};
