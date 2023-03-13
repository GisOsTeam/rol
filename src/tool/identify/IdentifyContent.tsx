import { IdentifyFilterType } from '@gisosteam/aol/source/query/identify';
import { createLayerStyles } from '@gisosteam/aol/utils';
import GeometryType from 'ol/geom/GeometryType';
import * as React from 'react';
import { rolContext } from '../../RolContext';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';
import { IQueryResponseFeatures } from '../common';
import { DisplayedFeaturesType, FeatureTable } from '../featureTable/FeatureTable';
import { useDrawSource } from '../hook/useDrawSource';
import { IIdentifyResponse, useIdentify } from '../hook/useIdentify';

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
      width: 4,
      radius: props.tolerance != null ? props.tolerance : 6,
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

  const filterListableSource: IdentifyFilterType = React.useCallback(
    (extended) => {
      return extended !== source;
    },
    [source]
  );

  const onIdentifyResponse = React.useCallback(
    (identifyResp: IIdentifyResponse) => {
      const newFeatures: IQueryResponseFeatures = {};
      Object.keys(identifyResp.features).forEach((layerElementUid) => {
        const layerElement = layersManager.getLayerElementByUID(layerElementUid);
        const layerElementProps = layerElement ? layerElement.reactElement.props : { uid: layerElementUid };
        const name = layerElementProps.name ? layerElementProps.name : layerElementProps.uid;
        newFeatures[name] = identifyResp.features[layerElementUid];
      });
      setIdentificationResponseFeatures(newFeatures);
    },
    [layersManager, setIdentificationResponseFeatures]
  );

  useIdentify({
    activated: props.activated === true,
    limit: props.limit,
    tolerance: props.tolerance,
    filterSources: filterListableSource,
    typeGeom: GeometryType.POINT,
    drawSource: source,
    onIdentifyResponse,
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
