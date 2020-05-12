import * as React from 'react';
import { useIdentify, IIdentifyResponse, IIdentifyResponseFeatures } from '../hook/useIdentify';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';
import { DisplayedFeaturesType, FeatureTable } from '../featureTable/FeatureTable';
import { useDrawSource } from '../hook/useDrawSource';
import { IdentifyFilterType, identify } from '@gisosteam/aol/source/query/identify';
import { rolContext } from '../../RolContext';
import { createLayerStyles } from '@gisosteam/aol/utils';
import { SimpleList } from '../composite/SimpleList';
import { SimpleItemComponent } from '../composite/SimpleItemComponent';

export const defaultHighlightStyle = createLayerStyles({
  fillColor: 'rgba(0, 255, 255, 0.2)',
  strokeColor: 'rgba(0, 0, 255, 0.9)',
  width: 3,
  radius: 3,
});

export interface IIdentifyContentProps extends IFunctionBaseWindowToolProps {
  limit?: number;
  tolerance?: number;
}

export function IdentifyContent(props: IIdentifyContentProps) {
  const [features, setFeatures] = React.useState<IIdentifyResponseFeatures>({});
  const { layersManager } = React.useContext(rolContext);

  const source = useDrawSource({
    layerUid: 'identify-highlight',
    persist: false,
    listable: false,
    styles: defaultHighlightStyle,
  });

  React.useEffect(() => {
    if (!props.activated && !props.open) {
      if (source) {
        source.clear();
      }
      setFeatures({});
    }
  }, [props.activated, props.open]);

  const filterListableSource: IdentifyFilterType = (extended) => {
    return extended !== source;
  };

  useIdentify({
    activated: props.activated ? props.activated : false,
    limit: props.limit,
    tolerance: props.tolerance,
    filterSources: filterListableSource,
    onIdentifyResponse: (identifyResp: IIdentifyResponse) => {
      const newFeatures: IIdentifyResponseFeatures = {};
      Object.keys(identifyResp.features).forEach((layerElementUid) => {
        const layerElement = layersManager.getLayerElementByUID(layerElementUid);
        const layerElementProps = layerElement ? layerElement.reactElement.props : { uid: layerElementUid };
        const name = layerElementProps.name ? layerElementProps.name : layerElementProps.uid;
        newFeatures[name] = identifyResp.features[layerElementUid];
      });
      setFeatures(newFeatures);
    },
  });

  const onDisplayedFeatureChange = (selectedFeatures: DisplayedFeaturesType) => {
    source.clear();
    source.addFeatures(selectedFeatures);
  };

  return <FeatureTable onChangeDisplayedFeature={onDisplayedFeatureChange} features={features} />;
}
