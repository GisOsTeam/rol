import * as React from 'react';

import { Feature, MapBrowserEvent } from 'ol';
import OlBaseLayer from 'ol/layer/Base';
import { Pixel } from 'ol/pixel';
import { rolContext } from '../../RolContext';
import {
  IQueryResponse,
  constructQueryRequestFromPixel,
  IExtended,
  IQueryFeatureTypeResponse
} from '@gisosteam/aol/source';
import { identify } from '@gisosteam/aol/source/query/identify';

export interface IIdentifyResponse {
  features: { [key: string]: Feature[] };
}

export interface IUseIdentifyProps {
  activated: boolean;
  callBack: (identifyResp: IIdentifyResponse) => unknown;
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
            const type = ftResp.type ? ftResp.type.id : 'unknown';
            if (!features[type]) {
              features[type] = [];
            }
            features[type].push(...ftResp.features);
          });
        });
        props.callBack({ features });
      });;
    };

    if (props.activated) {
      olMap.on('click', onClick);
    } else {
      olMap.un('click', onClick);
    }
    return () => {
      olMap.un('click', onClick);
    };
  }, [props.activated, props.callBack]);

  return null;
}
