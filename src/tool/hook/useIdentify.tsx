import * as React from 'react';

import { Feature, MapBrowserEvent } from 'ol';
import { rolContext } from '../../RolContext';
import { identify } from '@gisosteam/aol/source/query/identify';
import { IQueryResponse, IQueryFeatureTypeResponse } from '@gisosteam/aol/source/IExtended';



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
}

export function useIdentify(props: IUseIdentifyProps): Promise<IIdentifyResponse> {
  const context = React.useContext(rolContext);
  const { olMap } = context;

  React.useEffect(() => {
    const onClick = (clickEvent: MapBrowserEvent) => {
      identify(clickEvent.pixel, olMap).then((queryResponses: IQueryResponse[]) => {
        const features: any = {};
        queryResponses.forEach((queryResponse: IQueryResponse) => {
          const ftResps = queryResponse.featureTypeResponses;
          ftResps.forEach((ftResp: IQueryFeatureTypeResponse) => {
            if (ftResp.features.length > 0) {
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
  }, [props.activated, props.onIdentifyResponse]);

  return null;
}
