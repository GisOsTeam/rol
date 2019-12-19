import * as React from 'react';
import { useIdentify, IIdentifyResponse, IIdentifyResponseFeatures } from '../hook/useIdentify';
import { IBaseWindowToolProps, IBaseWindowToolState } from '../BaseWindowTool';
import { FeatureTable } from '../featureTable';

type Props = IBaseWindowToolProps & Pick<IBaseWindowToolState, 'open'>;

export function IdentifyContent (props: Props) {
  const [features, setFeatures] = React.useState({} as IIdentifyResponseFeatures);

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
