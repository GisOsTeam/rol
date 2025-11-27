import * as React from 'react';
import styled from 'styled-components';
import { Feature, getUid } from 'ol';
import { Table, ITableFeature, objectToITableFeature } from './Table';
import { IQueryResponseFeatures } from '../common';

const Container = styled.div`
  display: flex;
`;

export interface IFeatureTableProps {
  identificationResponseFeatures: IQueryResponseFeatures;
  onChangeDisplayedFeature?: (newDisplayedFeature: Feature) => void;
}

export const FeatureTable = (props: IFeatureTableProps) => {
  const [displayedObject, setDisplayedObject] = React.useState<Feature>(null);
  const [nameFeatures, setNameFeatures] = React.useState<{ [name: string]: Feature<any>[] }>({});

  React.useEffect(() => {
    const nameFeaturesTmp: { [name: string]: Feature<any>[] } = {};
    for (const sourceId in props.identificationResponseFeatures) {
      const elem = props.identificationResponseFeatures[sourceId];
      for (const typeId in elem.types) {
        const type = elem.types[typeId];
        const name = `${elem.layerProps.name} ${
          type.type
            ? type.type.name
              ? type.type.name
              : typeof type.type.id === 'number'
                ? `(${type.type.id})`
                : ''
            : ''
        }`;
        nameFeaturesTmp[name] = type.features;
      }
    }
    setNameFeatures(nameFeaturesTmp);
    setDisplayedObject(null);
    return () => {
      setDisplayedObject(null);
    };
  }, [props.identificationResponseFeatures]);

  const renderContent = () => {
    if (displayedObject == null) {
      return null;
    }
    const customFeatureId = 'feature_id';
    let customFeat: any = {};
    const id = displayedObject.getId && displayedObject.getId() ? displayedObject.getId() : getUid(displayedObject);
    customFeat[customFeatureId] = id;
    customFeat = {
      ...customFeat,
      ...displayedObject.getProperties(),
    };
    const displayedFeat = objectToITableFeature(customFeat);

    return <Table feature={displayedFeat} header={['Details']} />;
  };

  const featureSummary: ITableFeature = {};
  const highlightedKeys: number[] = [];
  let featureSummaryLength = 0;
  for (const type in nameFeatures) {
    if (!featureSummary[type]) {
      featureSummary[type] = [];
    }
    nameFeatures[type].forEach((feature) => {
      const id = feature.getId && feature.getId() ? feature.getId() : getUid(feature);
      featureSummary[type].push(id.toString());
      if (displayedObject === feature) {
        console.log(featureSummaryLength, id);
        highlightedKeys.push(featureSummaryLength);
      }
      ++featureSummaryLength;
    });
  }

  const onClickTab = (key: string, value: string) => {
    const newFeature = nameFeatures[key].filter((feat) => feat.getId() === value || getUid(feat) === value).pop();
    if (props.onChangeDisplayedFeature) {
      props.onChangeDisplayedFeature(newFeature);
    }
    setDisplayedObject(newFeature);
  };

  return (
    <Container>
      <Table feature={featureSummary} header={['Features']} onClickRow={onClickTab} highlightedKeys={highlightedKeys} />
      {renderContent()}
    </Container>
  );
};
