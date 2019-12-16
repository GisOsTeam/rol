import * as React from 'react'
import { IIdentifyResponse } from '../hook/useIdentify';
import { Feature } from 'ol';

// CSS
import '../../assets/css/featureTable.css';

type SetterType = React.Dispatch<React.SetStateAction<Feature[]>>;
export type IFeatureTableProps = Pick<IIdentifyResponse, 'features'>;
export const FeatureTable : React.FC<IFeatureTableProps> = ({ features } : IFeatureTableProps) => {
    const [displayedObjects, setDisplayedObjects]: [Feature[], SetterType] = React.useState([])
    
    const featureKeys = Object.keys(features);
    React.useEffect(() => {
        const firstKey: string = featureKeys[0];
        const firstFeatures: Feature[] = features[firstKey] ? [features[firstKey][0]] : [];
        setDisplayedObjects(firstFeatures);
        return () => {
            setDisplayedObjects([]);
        }
    }, [features]);
    
    const renderTabs = () => {
        const tabs: React.ReactElement[] = [];
        featureKeys.forEach((layerName: string, layerIndex) => {
            features[layerName].forEach((feature: Feature) => {
                const htmlElem = (<tr className={`tab-layer-row ${(tabs.length+1)%2 ? 'odd' : 'even'}`} key={`layerTab-${layerIndex}-${feature.getId()}`} onClick={() => setDisplayedObjects([feature])}>
                    <td className="label-cell">{layerName}</td>
                    <td className="value-cell">{feature.getId()}</td>
                </tr>)
                tabs.push(htmlElem);
            })
        });
        return (
            <tbody>
                {tabs}
            </tbody>);
    };

    const featureToHtml = (feature: Feature, index: number) => {
        const featureProps = feature.getProperties();
        const customFeatureId = 'feature_id';
        featureProps[customFeatureId] = feature.getId();
        const elems: React.ReactElement[] = Object.keys(featureProps)
                .filter((prop) => typeof featureProps[prop] !== 'object')
                .sort((a: string, b: string) => {
                    if(a === customFeatureId) {
                        return -1;
                    } else if (b === customFeatureId) {
                        return 1;
                    } else {
                        return a > b ? 1 : -1;
                    }
                })
                .map((prop: string, propIndex) => {
                    return (<tr 
                    className={`popup-table-row ${propIndex%2 ? 'even': 'odd'}`} 
                    key={`${prop}-${propIndex}-${index}`}>
                                <td className="label-cell">{prop}:</td>
                                <td className="value-cell"> {featureProps[prop]}</td>
                            </tr>);
                }); 
        return elems;
    };

    const renderContent = () => {
        const htmlEntities: React.ReactElement[] = displayedObjects.map((feature: Feature, featureIndex: number) => {
            return (<table className="feature-table" key={`feature-body-${featureIndex}`}>
                    <tbody className="feature-body">
                        { featureToHtml(feature, featureIndex) }
                </tbody>
            </table>)
        });
        return htmlEntities;
    };

    const isEmpty = featureKeys.length > 0 ? false : true;
    if (isEmpty) {
        return  (<div className="features-by-layers-wrapper">
            No data to display
        </div>);
    }
    return (<div className="features-by-layers-wrapper">
        <table className="layerTabs-wrapper">
            {renderTabs()}
        </table>
        {renderContent()}
    </div>);
}