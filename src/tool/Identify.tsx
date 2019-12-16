import * as React from 'react';
import { useIdentify, IIdentifyResponse, IIdentifyResponseFeatures } from './hook/useIdentify';
import { withBaseWindowTool, IBaseWindowToolProps } from './BaseWindowTool';
import { WindowFeaturesByLayers } from './windowFeaturesByLayers';

let position: [number, number];
export const Identify = withBaseWindowTool((props: IBaseWindowToolProps): React.ReactElement => {
  const [features, setFeatures] = React.useState({} as IIdentifyResponseFeatures);
  useIdentify({
      activated: props.activated ? props.activated : false,
      callBack: (identifyResp: IIdentifyResponse) => {
        position = identifyResp.position as [number, number];
        setFeatures(identifyResp.features);
      }
    });

    return <WindowFeaturesByLayers features={features} position={position} />
  }, (props: IBaseWindowToolProps) => {
    return <span>Identify</span>;
  },
  // Open Button Content
  (props: IBaseWindowToolProps) => {
    return <span>Identify</span>;
  });
