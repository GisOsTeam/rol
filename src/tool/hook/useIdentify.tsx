import * as React from 'react';
import { Feature, MapBrowserEvent } from 'ol';
import { rolContext } from '../../RolContext';
import { IQueryFeatureTypeResponse, IQueryResponse } from '@gisosteam/aol/source/IExtended';
import { identify, IdentifyFilterType } from '@gisosteam/aol/source/query/identify';

export interface IIdentifyResponseFeatures {
  [key: string]: Feature[];
}
export interface IIdentifyResponse {
  features: IIdentifyResponseFeatures;
  position: number[];
}

export interface IUseIdentifyProps {
  activated: boolean;
  onIdentifyResponse: (identifyResp: IIdentifyResponse) => unknown;
  limit?: number;
  tolerance?: number;
  filterSources?: IdentifyFilterType;
}

export function useIdentify(props: IUseIdentifyProps): Promise<IIdentifyResponse> {
  const context = React.useContext(rolContext);
  const { olMap, layersManager } = context;

  React.useEffect(() => {
    const onClick = (clickEvent: MapBrowserEvent) => {
      identify(clickEvent.pixel, olMap, props.limit, props.tolerance, props.filterSources).then((queryResponses: IQueryResponse[]) => {
        const features: any = {};
        queryResponses.forEach((queryResponse: IQueryResponse) => {
          const { featureTypeResponses } = queryResponse;
          featureTypeResponses.forEach((ftResp: IQueryFeatureTypeResponse) => {
            if (ftResp.features.length > 0) {
              const filtered = layersManager.getLayerElementFromSource(ftResp.source);
              const layerUid = filtered ? filtered.uid : 'unknown';
              if (!features[layerUid]) {
                features[layerUid] = [];
              }
              features[layerUid].push(...ftResp.features);
            }
          });
        });
        props.onIdentifyResponse({ features, position: clickEvent.pixel });
      });
    };

    if (props.activated) {
      olMap.on('click', onClick);
    } else {
      olMap.un('click', onClick);
    }
    return () => {
      olMap.un('click', onClick);
    };
  }, [props.activated, props.onIdentifyResponse, props.filterSources]);

  return null;
}
