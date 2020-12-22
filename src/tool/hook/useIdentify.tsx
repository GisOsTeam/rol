import * as React from 'react';
import { Feature, MapBrowserEvent } from 'ol';
import { rolContext } from '../../RolContext';
import { IQueryFeatureTypeResponse, IQueryResponse, LayersPrefixEnum } from '@gisosteam/aol/source/IExtended';
import { identify, IdentifyFilterType } from '@gisosteam/aol/source/query/identify';
import { getFeaturesBySourceFromQueryResponse } from '../common/getIIdentifyResponseFeaturesFromQueryResponse';
import { getFeaturesBySourceByLayersFromQueryResponse } from '../common/getIIdentifyResponseFeaturesByLayersFromQueryResponse';

export interface IIdentifyResponseFeatures {
  [key: string]: Feature[];
}

export interface IIdentifyResponseFeaturesByLayer {
  [sourceId: string]: {
    [layerId: string]: Feature[];
  };
}

export interface IIdentifyResponse {
  features: IIdentifyResponseFeatures;
  position: number[];
}

export interface IIdentifyResponseByLayer {
  features: IIdentifyResponseFeaturesByLayer;
  position: number[];
}

export interface IUseIdentifyCommonProps {
  activated: boolean;

  /**
   * Pris en compte que sur les couches AGS
   */
  layersParam?: LayersPrefixEnum;

  limit?: number;
  tolerance?: number;
  filterSources?: IdentifyFilterType;
}

export interface IUseIdentifyProps extends IUseIdentifyCommonProps {
  onIdentifyResponse?: (identifyResp: IIdentifyResponse) => unknown;

  onIdentifyResponseWithLayerGroup?: (idenfityResponseByLayer: IIdentifyResponseByLayer) => unknown;
}

export function useIdentify(props: IUseIdentifyProps): Promise<IIdentifyResponse> {
  const context = React.useContext(rolContext);
  const { olMap, layersManager } = context;

  React.useEffect(() => {
    const onClick = (clickEvent: MapBrowserEvent) => {
      identify(clickEvent.pixel, olMap, props.limit, props.tolerance, props.filterSources, props.layersParam).then(
        (queryResponses: IQueryResponse[]) => {
          const position = clickEvent.pixel;
          if (props.onIdentifyResponse) {
            const features: any = getFeaturesBySourceFromQueryResponse(queryResponses, layersManager);
            props.onIdentifyResponse({ features, position });
          }

          if (props.onIdentifyResponseWithLayerGroup) {
            const featsByLayer = getFeaturesBySourceByLayersFromQueryResponse(queryResponses, layersManager);
            props.onIdentifyResponseWithLayerGroup({ features: featsByLayer, position });
          }
        }
      );
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
