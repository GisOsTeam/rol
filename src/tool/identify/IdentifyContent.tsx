import * as React from 'react';
import { useIdentify, IIdentifyResponse, IIdentifyResponseFeatures } from '../hook/useIdentify';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';
import { FeatureTable } from '../featureTable';

export function IdentifyContent(props: IFunctionBaseWindowToolProps) {
  const [features, setFeatures] = React.useState<IIdentifyResponseFeatures>({});

  React.useEffect(() => {
    if (!props.activated && props.open) {
      setFeatures({});
    }
  }, [props.activated, props.open]);

  useIdentify({
    activated: props.activated ? props.activated : false,
    onIdentifyResponse: (identifyResp: IIdentifyResponse) => {
      setFeatures(identifyResp.features);
    }
  });

  return <FeatureTable features={features} />;
}
