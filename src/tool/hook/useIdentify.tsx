import * as React from 'react';
import { Feature, MapBrowserEvent, Map } from 'ol';
import OlBaseLayer from 'ol/layer/Base';
import { Pixel } from 'ol/pixel';
import { rolContext } from '../../RolContext';
import { IQueryResponse, constructQueryRequestFromPixel, IExtended, IQueryFeatureTypeResponse } from '@gisosteam/aol/source';
import { walk } from '@gisosteam/aol/utils';
import Layer from 'ol/layer/Layer';

// In AOL 0.0.4
export interface IIdentifyResponse {
    features: { [key: string]: Feature[] }
}

export interface IUseIdentifyProps {
    activated: boolean;
    callBack: (identifyResp: IIdentifyResponse) => unknown;
};

export function useIdentify(props: IUseIdentifyProps): Promise<IIdentifyResponse> {
    const context = React.useContext(rolContext);
    // Send to AOL
    const identify = (pixel: Pixel, map: Map) : Promise<IIdentifyResponse> => {
        if (map && pixel) {
            const promises: Array<Promise<IQueryResponse>> = [];
            const queryRequest = constructQueryRequestFromPixel(pixel, 2, map);
            queryRequest.limit = 10;
            
            walk(map, (layer: OlBaseLayer) => {
                if (layer.getVisible() && 'getSource' in layer) {
                    const source = (layer as Layer).getSource();
                    if (source && 'query' in source) {
                        promises.push((source as IExtended).query(queryRequest));
                    }
                }
                return true;
            });

            return Promise.all(promises).then();
        }
    };
    
    const queryResponseToIdentifyResponse = (queryResponses: IQueryResponse[]) => {
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
        return { features };
    };

    React.useEffect(() => {
        const { olMap } = context;
        const onClick = (clickEvent: MapBrowserEvent) => {
            identify(clickEvent.pixel, olMap).then((resp: IIdentifyResponse) => 
            props.callBack(queryResponseToIdentifyResponse(resp))
            );
        };
        
        if (props.activated) {
            olMap.on('click', onClick);
        } else {
            olMap.un('click', onClick)
        }
        return () => {
            olMap.un('click', onClick);    
        };
    }, [props.activated, props.callBack]);

    
    return null;
}