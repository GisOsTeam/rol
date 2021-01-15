import * as React from 'react';
import { IQueryResponseFeatures } from '../common';
import { useIdentify, IIdentifyResponse } from '../hook/useIdentify';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';
import { DisplayedFeaturesType, FeatureTable } from '../featureTable/FeatureTable';
import { useDrawSource } from '../hook/useDrawSource';
import { IdentifyFilterType } from '@gisosteam/aol/source/query/identify';
import { rolContext } from '../../RolContext';
import GeometryType from 'ol/geom/GeometryType';
import { createLayerStyles } from '@gisosteam/aol/utils';

export interface IIdentifyContentProps extends IFunctionBaseWindowToolProps {
  limit?: number;
  tolerance?: number;
}

export function IdentifyContent(props: IIdentifyContentProps) {
  const [identificationResponseFeatures, setIdentificationResponseFeatures] = React.useState<IQueryResponseFeatures>(
    {}
  );
  const { layersManager } = React.useContext(rolContext);

  const source = useDrawSource({
    layerUid: 'identify-tool-draw-source',
    styles: createLayerStyles({
      strokeColor: 'rgba(0, 0, 255, 0.9)',
      fillColor: 'rgba(127, 127, 127, .6)',
      width: 6,
      radius: 6,
    }),
  });

  React.useEffect(() => {
    if (!props.activated && !props.open) {
      if (source) {
        source.clear();
      }
      setIdentificationResponseFeatures({});
    }
  }, [props.activated, props.open]);

  const filterListableSource: IdentifyFilterType = (extended) => {
    return extended !== source;
  };

  useIdentify({
    activated: props.activated === true,
    limit: props.limit,
    tolerance: props.tolerance,
    filterSources: filterListableSource,
    typeGeom: GeometryType.POINT,
    drawSource: source,
    onIdentifyResponse: (identifyResp: IIdentifyResponse) => {
      const newFeatures: IQueryResponseFeatures = {};
      Object.keys(identifyResp.features).forEach((layerElementUid) => {
        const layerElement = layersManager.getLayerElementByUID(layerElementUid);
        const layerElementProps = layerElement ? layerElement.reactElement.props : { uid: layerElementUid };
        const name = layerElementProps.name ? layerElementProps.name : layerElementProps.uid;
        newFeatures[name] = identifyResp.features[layerElementUid];
      });
      setIdentificationResponseFeatures(newFeatures);
    },
  });

  const onDisplayedFeatureChange = (selectedFeatures: DisplayedFeaturesType) => {
    source.clear();
    source.addFeatures(selectedFeatures);
  };

  return (
    <FeatureTable
      onChangeDisplayedFeature={onDisplayedFeatureChange}
      identificationResponseFeatures={identificationResponseFeatures}
    />
  );
}
