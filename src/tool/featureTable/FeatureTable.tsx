import * as React from 'react';
import { IIdentifyResponse } from '../hook/useIdentify';
import { Feature, getUid } from 'ol';

// CSS
import '../../assets/css/featureTable.css';
import { Table, ITableFeature, objectToITableFeature } from './Table';

type SetterType = React.Dispatch<React.SetStateAction<Feature[]>>;
export type DisplayedFeaturesType = Feature[];
export interface IFeatureTableProps extends Pick<IIdentifyResponse, 'features'> {
  onChangeDisplayedFeature ?: (newDisplayedFeatures: DisplayedFeaturesType) => void;
};
export const FeatureTable: React.FC<IFeatureTableProps> = ({ features, onChangeDisplayedFeature }: IFeatureTableProps) => {
  const [displayedObjects, setDisplayedObjects]: [DisplayedFeaturesType, SetterType] = React.useState([]);

  const layerNames = Object.keys(features);

  React.useEffect(() => {
    const firstKey: string = layerNames[0];
    const firstFeatures: Feature[] = features[firstKey] ? [features[firstKey][0]] : [];
    if (onChangeDisplayedFeature && firstFeatures.length > 0) {
      console.log("pwet", firstFeatures);
      onChangeDisplayedFeature(firstFeatures);
    }
    setDisplayedObjects(firstFeatures);
    return () => {
      setDisplayedObjects([]);
    };
  }, [features]);

  const renderContent = () => {
    const htmlEntities: React.ReactElement[] = displayedObjects.map((feature: Feature, featureIndex: number) => {
      const customFeatureId = 'feature_id';
      let customFeat: any = {};
      const id = feature.getId && feature.getId() ? feature.getId() : getUid(feature);
      customFeat[customFeatureId] = id;
      customFeat = {
        ...customFeat,
        ...feature.getProperties()
      };
      const displayedFeat = objectToITableFeature(customFeat);
      return <Table feature={displayedFeat} key={`feature-body-${featureIndex}-${feature.getId()}`} />;
    });
    return htmlEntities;
  };

  const isEmpty = layerNames.length > 0 ? false : true;
  if (isEmpty) {
    return <div className="features-by-layers-wrapper">No data to display</div>;
  }

  const featureSummary: ITableFeature = {};
  const highlightedKeys: number[] = [];
  let featureSummaryLength = 0;
  layerNames.forEach(layerName => {
    if (!featureSummary[layerName]) {
      featureSummary[layerName] = [];
    }
    features[layerName].forEach(feature => {
      const id = feature.getId && feature.getId() ? feature.getId() : getUid(feature);
      featureSummary[layerName].push(id.toString());
      if (displayedObjects.lastIndexOf(feature) > -1) {
        highlightedKeys.push(featureSummaryLength);
      }
      ++featureSummaryLength;
    });
  });

  const onClickTab = (key: string, value: string, index: number) => {
    const newFeatures = features[key].filter(feat => feat.getId() === value || getUid(feat) === value);
    if (onChangeDisplayedFeature) {
      onChangeDisplayedFeature(newFeatures);
    }
    setDisplayedObjects(newFeatures);
  };

  return (
    <div className="features-by-layers-wrapper">
      <Table
        feature={featureSummary}
        onClickRow={onClickTab}
        highlightedKeys={highlightedKeys}
        className="layerTabs-wrapper"
      />
      {renderContent()}
    </div>
  );
};
