import * as React from 'react';
import { useIdentify, IIdentifyResponse, IIdentifyResponseFeatures } from '../hook/useIdentify';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';
import { DisplayedFeaturesType, FeatureTable } from '../featureTable';
import { useDrawSource } from '../hook/useDrawSource';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

// Move to AOL
export const defaultHighlightStyle = new Style({
  fill: new Fill({color: 'rgba(0, 255, 0, 0.25)'}),
  stroke: new Stroke({color: 'rgba(0, 255, 0, 0.9)'})
});

export function IdentifyContent(props: IFunctionBaseWindowToolProps) {
  const [features, setFeatures] = React.useState<IIdentifyResponseFeatures>({});
  const source = useDrawSource({
    layerUid: 'identify-highlight',
    persist: false,
    listable: false
  });
  
  React.useEffect(() => {
    if (!props.activated && !props.open) {
      if(source) {
        source.clear();
      }
      setFeatures({});
    }
  }, [props.activated, props.open]);

  useIdentify({
    activated: props.activated ? props.activated : false,
    onIdentifyResponse: (identifyResp: IIdentifyResponse) => {
      setFeatures(identifyResp.features);
    }
  });


  if (Object.keys(features).length > 0) {
    let identified: any = [];
    Object.values(features).forEach((featArray) => identified = identified.concat(...featArray));
    source.clear();
    source.addFeatures(identified);  
  }
  
  const onDisplayedFeatureChange = (selectedFeatures: DisplayedFeaturesType) => {
    if (source) {
      Object.values(features).forEach((featArray) => {
        featArray.forEach((feat) => {
          if(selectedFeatures.indexOf(feat) > -1) {
            feat.setStyle(defaultHighlightStyle);
          } else {
            feat.setStyle(undefined);
          }
        })
      });
    }
  };

  return <FeatureTable onChangeDisplayedFeature={onDisplayedFeatureChange} features={features} />;
}
