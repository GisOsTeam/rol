import * as React from 'react'
import { IIdentifyResponse } from '../hook/useIdentify';
import { Feature, getUid } from 'ol';

// CSS
import '../../assets/css/featureTable.css';
import { Table, ITableFeature, objectToITableFeature } from './Table';

type SetterType = React.Dispatch<React.SetStateAction<Feature[]>>;
export type IFeatureTableProps = Pick<IIdentifyResponse, 'features'>;
export const FeatureTable : React.FC<IFeatureTableProps> = ({ features } : IFeatureTableProps) => {
    const [displayedObjects, setDisplayedObjects]: [Feature[], SetterType] = React.useState([])
    
    const featuresKeys = Object.keys(features);
    
    React.useEffect(() => {
        const firstKey: string = featuresKeys[0];
        const firstFeatures: Feature[] = features[firstKey] ? [features[firstKey][0]] : [];
        setDisplayedObjects(firstFeatures);
        return () => {
            setDisplayedObjects([]);
        }
    }, [features]);

    const renderContent = () => {
        const htmlEntities: React.ReactElement[] = displayedObjects.map((feature: Feature, featureIndex: number) => {
            const customFeatureId = 'feature_id';
            let customFeat: any = {};
            const id = (feature.getId && feature.getId()) ? feature.getId() : getUid(feature);
            customFeat[customFeatureId] = id;
            customFeat = {
                ...customFeat,
                ...feature.getProperties()
            };
            const displayedFeat = objectToITableFeature(customFeat);
            return <Table feature={displayedFeat} key={`feature-body-${featureIndex}-${feature.getId()}`}/>
        });
        return htmlEntities;
    };

    const isEmpty = featuresKeys.length > 0 ? false : true;
    if (isEmpty) {
        return  (<div className="features-by-layers-wrapper">
            No data to display
        </div>);
    }

    const featureSummary : ITableFeature = {};
    featuresKeys.forEach((key) => {
        if (!featureSummary[key]) {
            featureSummary[key] = []
        }
        features[key].forEach((feature) => {
            const id = (feature.getId && feature.getId()) ? feature.getId() : getUid(feature);
            featureSummary[key].push(id.toString());
        });
    });

    const onClickTab = (key: string, value: string) => {
        setDisplayedObjects(features[key].filter((feat) => feat.getId() === value || getUid(feat) === value));
    };

    return (<div className="features-by-layers-wrapper">
        <Table feature={featureSummary} onClickRow={onClickTab} className="layerTabs-wrapper"/>
        {renderContent()}
    </div>);
}