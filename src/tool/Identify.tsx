import * as React from 'react';
import { useIdentify, IIdentifyResponse, IIdentifyResponseFeatures } from './hook/useIdentify';
import { withBaseWindowTool, IBaseWindowToolProps } from './BaseWindowTool';
import { FeatureTable } from './featureTable';

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

    return <FeatureTable features={features} />
  }, (props: IBaseWindowToolProps) => {
    return <span>Identify</span>;
  },
  // Open Button Content
  (props: IBaseWindowToolProps) => {
    return <span>Identify</span>;
  });
