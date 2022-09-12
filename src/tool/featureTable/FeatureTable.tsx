import * as React from 'react';
import styled from 'styled-components';
import { Feature, getUid } from 'ol';
import { Table, ITableFeature, objectToITableFeature } from './Table';
import { IQueryResponseFeatures } from '../common';

const Container = styled.div`
  display: flex;
`;

type SetterType = React.Dispatch<React.SetStateAction<Feature<any>[]>>;

export type DisplayedFeaturesType = Feature<any>[];

export interface IFeatureTableProps {
  identificationResponseFeatures: IQueryResponseFeatures;
  onChangeDisplayedFeature?: (newDisplayedFeatures: DisplayedFeaturesType) => void;
}

export const FeatureTable = (props: IFeatureTableProps) => {
  const [displayedObjects, setDisplayedObjects]: [DisplayedFeaturesType, SetterType] = React.useState([]);
  const [nameFeatures, setNameFeatures] = React.useState<{ [name: string]: Feature<any>[] }>({});

  React.useEffect(() => {
    let firstFeature = null;
    const nameFeaturesTmp: { [name: string]: Feature<any>[] } = {};
    for (const sourceId in props.identificationResponseFeatures) {
      const elem = props.identificationResponseFeatures[sourceId];
      for (const typeId in elem.types) {
        const type = elem.types[typeId];
        const name = `${elem.layerProps.name} ${
          type.type.name ? type.type.name : typeof type.type.id === 'number' ? `(${type.type.id})` : ''
        }`;
        nameFeaturesTmp[name] = type.features;
        firstFeature = type.features[0];
      }
    }
    setNameFeatures(nameFeaturesTmp);

    if (firstFeature != null) {
      setDisplayedObjects([firstFeature]);
    }
    return () => {
      setDisplayedObjects([]);
    };
  }, [props.identificationResponseFeatures]);

  const renderContent = () => {
    const htmlEntities: React.ReactElement[] = displayedObjects.map((feature: Feature<any>, featureIndex: number) => {
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

  const featureSummary: ITableFeature = {};
  const highlightedKeys: number[] = [];
  let featureSummaryLength = 0;
  let isEmpty = true;
  for (const type in nameFeatures) {
    if (!featureSummary[type]) {
      featureSummary[type] = [];
    }
    nameFeatures[type].forEach((feature) => {
      isEmpty = false;
      const id = feature.getId && feature.getId() ? feature.getId() : getUid(feature);
      featureSummary[type].push(id.toString());
      if (displayedObjects.lastIndexOf(feature) > -1) {
        highlightedKeys.push(featureSummaryLength);
      }
      ++featureSummaryLength;
    });
  }
  if (isEmpty) {
    return <Container>No data to display</Container>;
  }

  const onClickTab = (key: string, value: string, index: number) => {
    const newFeatures = nameFeatures[key].filter((feat) => feat.getId() === value || getUid(feat) === value);
    if (props.onChangeDisplayedFeature) {
      props.onChangeDisplayedFeature(newFeatures);
    }
    setDisplayedObjects(newFeatures);
  };

  return (
    <Container>
      <Table feature={featureSummary} header={['Feature']} onClickRow={onClickTab} highlightedKeys={highlightedKeys} />
      {renderContent()}
    </Container>
  );
};
