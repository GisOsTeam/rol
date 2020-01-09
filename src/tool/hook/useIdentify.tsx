import * as React from 'react';

import { Feature, MapBrowserEvent } from 'ol';
import { rolContext } from '../../RolContext';
import { IQueryFeatureTypeResponse, IQueryResponse } from '@gisosteam/aol/source/IExtended';
import { ILayerElement } from '../../LayersManager';
import { identify, IdentifyFilterType, IIdentifyQueryResponse } from '@gisosteam/aol/source/query/identify';

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
  filterSources?: IdentifyFilterType;
}

export function useIdentify(props: IUseIdentifyProps): Promise<IIdentifyResponse> {
  const context = React.useContext(rolContext);
  const { olMap, layersManager } = context;

  React.useEffect(() => {
    const onClick = (clickEvent: MapBrowserEvent) => {
      identify(clickEvent.pixel, olMap, undefined, props.filterSources).then((queryResponses: IQueryResponse[]) => {
        const features: any = {};
        queryResponses.forEach((queryResponse: IIdentifyQueryResponse) => {
        const { featureTypeResponses , olLayer } = queryResponse;
          featureTypeResponses.forEach((ftResp: IQueryFeatureTypeResponse) => {
            if (ftResp.features.length > 0) {
              console.log("ollayer", olLayer)
              const filtered = layersManager.getLayerElements((layerElement: ILayerElement) => {
                return layerElement.olLayer === olLayer
              })
              console.log("filtered", filtered);
              const type = ftResp.type ? ftResp.type.id : 'unknown';
              if (!features[type]) {
                features[type] = [];
              }
              features[type].push(...ftResp.features);
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
