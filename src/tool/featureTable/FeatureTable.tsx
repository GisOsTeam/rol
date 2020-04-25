import * as React from 'react';
import styled from 'styled-components';
import { IIdentifyResponseFeatures } from '../hook/useIdentify';
import { Feature, getUid } from 'ol';
import { Table, ITableFeature, objectToITableFeature } from './Table';

const Container = styled.div`
  display: flex;
`;

type SetterType = React.Dispatch<React.SetStateAction<Feature[]>>;

export type DisplayedFeaturesType = Feature[];

export interface IFeatureTableProps {
  features: IIdentifyResponseFeatures;
  onChangeDisplayedFeature?: (newDisplayedFeatures: DisplayedFeaturesType) => void;
}

export const FeatureTable = (props: IFeatureTableProps) => {
  const [displayedObjects, setDisplayedObjects]: [DisplayedFeaturesType, SetterType] = React.useState([]);

  const layerUIDs = Object.keys(props.features);

  React.useEffect(() => {
    const firstKey: string = layerUIDs[0];
    const firstFeatures: Feature[] = props.features[firstKey] ? [props.features[firstKey][0]] : [];
    if (props.onChangeDisplayedFeature && firstFeatures.length > 0) {
      props.onChangeDisplayedFeature(firstFeatures);
    }
    setDisplayedObjects(firstFeatures);
    return () => {
      setDisplayedObjects([]);
    };
  }, [props.features]);

  const renderContent = () => {
    const htmlEntities: React.ReactElement[] = displayedObjects.map((feature: Feature, featureIndex: number) => {
      const customFeatureId = 'feature_id';
      let customFeat: any = {};
      const id = feature.getId && feature.getId() ? feature.getId() : getUid(feature);
      customFeat[customFeatureId] = id;
      customFeat = {
        ...customFeat,
        ...feature.getProperties(),
      };
      const displayedFeat = objectToITableFeature(customFeat);

      return <Table feature={displayedFeat} header={['Details']} key={`${featureIndex}-${feature.getId()}`} />;
    });
    return htmlEntities;
  };

  const isEmpty = layerUIDs.length > 0 ? false : true;
  if (isEmpty) {
    return <Container>No data to display</Container>;
  }

  const featureSummary: ITableFeature = {};
  const highlightedKeys: number[] = [];
  let featureSummaryLength = 0;
  layerUIDs.forEach((layerName) => {
    if (!featureSummary[layerName]) {
      featureSummary[layerName] = [];
    }
    props.features[layerName].forEach((feature) => {
      const id = feature.getId && feature.getId() ? feature.getId() : getUid(feature);
      featureSummary[layerName].push(id.toString());
      if (displayedObjects.lastIndexOf(feature) > -1) {
        highlightedKeys.push(featureSummaryLength);
      }
      ++featureSummaryLength;
    });
  });

  const onClickTab = (key: string, value: string, index: number) => {
    const newFeatures = props.features[key].filter((feat) => feat.getId() === value || getUid(feat) === value);
    if (props.onChangeDisplayedFeature) {
      props.onChangeDisplayedFeature(newFeatures);
    }
    setDisplayedObjects(newFeatures);
  };

  return (
    <Container>
      <Table
        feature={featureSummary}
        header={['Layer', 'Feature ID']}
        onClickRow={onClickTab}
        highlightedKeys={highlightedKeys}
      />
      {renderContent()}
    </Container>
  );
};
