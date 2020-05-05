import * as React from 'react';
import styled from 'styled-components';
import { rolContext } from '../../RolContext';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import { send, IResponse } from 'bhreq';
import { LayersManager } from '../../LayersManager';
import { useTranslate } from '../hook/useTranslate';
import { IWMSService } from '../../layer/IWMSService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const LayerContainer = styled.ul`
  display: flex;
  flex-direction: column;
  max-height: 200px;
  overflow-x: hidden;
  overflow-y: auto;
  list-style: none;
  padding: 0;
`;

const parser = new WMSCapabilities();

export interface IWmsLoaderProps {
  /**
   * Fixed GIS proxy url
   */
  gisProxyUrl?: string;
}

export const WmsLoader = (props: IWmsLoaderProps) => {
  const [capabilities, setCapabilities] = React.useState<any>(null);
  const [serverUrl, setServerUrl] = React.useState<string>('');
  const [gisProxyUrl, setGisProxyUrl] = React.useState<string>(props.gisProxyUrl ? props.gisProxyUrl : '');
  const [selected, setSelected] = React.useState<[string, string][]>([]);
  const translate = useTranslate();

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setServerUrl(event.currentTarget.value);
  };

  const handleGisProxyUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGisProxyUrl(event.currentTarget.value);
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    let capUrl = serverUrl;
    if (gisProxyUrl != null && gisProxyUrl !== '') {
      capUrl = `${gisProxyUrl}/${btoa(serverUrl)
        .replace('=', '%3D')
        .replace('/', '%2F')
        .replace('+', '%2B')}?service=WMS&version=1.3.0&request=GetCapabilities`;
    }
    return send({ url: capUrl }).then((response: IResponse) => {
      setCapabilities(parser.read(response.body));
    });
  };

  const handleCheckboxChange = (cbNname: string, cbDescription: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.currentTarget.checked === true) {
      setSelected(selected.concat([[cbNname, cbDescription]]));
    } else {
      setSelected(selected.filter((elem: [string, string]) => elem[0] !== cbNname));
    }
  };

  const handleAddButtonClick = (layersManager: LayersManager) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    selected.forEach((elem: [string, string]) => {
      const wmsService: IWMSService = {
        id: elem[0],
        serverURL: serverUrl,
        description: elem[1],
        name: elem[0],
      };
      layersManager.addWMS(wmsService, gisProxyUrl);
    });
  };

  return (
    <rolContext.Consumer>
      {(context) => (
        <Container>
          {capabilities == null && (
            <React.Fragment>
              <label htmlFor="serverUrl">
                {translate(
                  'wmsLoader.serverUrl',
                  'Enter WMS Server URL* (example: http://172.20.0.3:8080/geoserver/wms)'
                )}
              </label>
              <input id="url" type="text" value={serverUrl} onChange={handleUrlChange}></input>
              {(props.gisProxyUrl == null || props.gisProxyUrl === '') && (
                <React.Fragment>
                  <label htmlFor="gisProxyUrl">
                    {translate('wmsLoader.gisProxyUrl', 'Enter Gis Proxy URL (example: http://localhost:8181)')}
                  </label>
                  <input id="gisProxyUrl" type="text" value={gisProxyUrl} onChange={handleGisProxyUrlChange}></input>
                </React.Fragment>
              )}
              <button onClick={handleButtonClick} disabled={serverUrl === ''}>
                {translate('wmsLoader.load', 'Load capabilities')}
              </button>
            </React.Fragment>
          )}
          {capabilities != null && (
            <React.Fragment>
              <label htmlFor="name">
                {translate('wmsLoader.name', 'Enter name* (required, example: WMS service)')}
              </label>
              <LayerContainer>
                <label>{translate('wmsLoader.selection', 'Select layers*')}</label>
                {capabilities.Capability.Layer.Layer.map((layer: any) => {
                  return (
                    <li key={layer.Name}>
                      <input
                        id={layer.Name}
                        type="checkbox"
                        onChange={handleCheckboxChange(layer.Name, layer.Abstract)}
                        checked={selected.filter((elem: [string, string]) => elem[0] === layer.Name).length > 0}
                      />
                      <label htmlFor={layer.Name}>{layer.Name}</label>
                    </li>
                  );
                })}
              </LayerContainer>
              <button onClick={handleAddButtonClick(context.layersManager)} disabled={selected.length === 0}>
                {translate('wmsLoader.add', 'Add selected')}
              </button>
            </React.Fragment>
          )}
        </Container>
      )}
    </rolContext.Consumer>
  );
};
