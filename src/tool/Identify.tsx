import * as React from 'react';
import { useIdentify, IIdentifyResponse, IIdentifyResponseFeatures } from './hook/useIdentify';
import { withBaseWindowTool, IBaseWindowToolProps } from './BaseWindowTool';
import { FeatureTable } from './featureTable';

export const Identify = withBaseWindowTool((props: IBaseWindowToolProps): React.ReactElement => {
  const [features, setFeatures] = React.useState({} as IIdentifyResponseFeatures);

  useIdentify({
      activated: props.activated ? props.activated : false,
      onIdentifyResponse: (identifyResp: IIdentifyResponse) => {
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
