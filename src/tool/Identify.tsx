import * as React from 'react';
import { useIdentify, IIdentifyResponse, IIdentifyResponseFeatures } from './hook/useIdentify';
import { withBaseWindowTool, IBaseWindowToolProps } from './BaseWindowTool';
import { windowFeaturesByLayers } from './windowFeaturesByLayers';

let position: [number, number];
export const Identify = withBaseWindowTool((props: IBaseWindowToolProps): React.ReactElement => {
  const [features, setFeatures] = React.useState({} as IIdentifyResponseFeatures);
  useIdentify({
      activated: props.activated ? props.activated : false,
      callBack: (identifyResp: IIdentifyResponse) => {
        position = identifyResp.position as [number, number];
        setFeatures(identifyResp.features);
      }
    });

    const renderTabs = () => {
      const tabs: React.ReactElement[] = [];
      Object.keys(features).forEach((layerName, layerIndex) => {
        const htmlElem = (<div className="tab-layer-row" key={`layerTab-${layerIndex}`}>
          <p>{layerName}</p>
          <p>{features[layerName].length}</p>
          </div>)
        tabs.push(htmlElem);
      });
      return tabs;
    };

    return windowFeaturesByLayers({ features, position });
  }, (props: IBaseWindowToolProps) => {
    return <span>Identify</span>;
  },
  // Open Button Content
  (props: IBaseWindowToolProps) => {
    return <span>Identify</span>;
  });
