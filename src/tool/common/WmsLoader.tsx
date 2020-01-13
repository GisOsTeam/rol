import * as React from 'react';
import styled from 'styled-components';
import { rolContext } from '../../RolContext';
import WMSCapabilities from 'ol/format/WMSCapabilities';
import { send, IResponse } from 'bhreq';
import { LayersManager } from '../../LayersManager';
import { ImageWms } from '@gisosteam/aol/source/ImageWms';
import { Image } from '../../layer';
import { loadWMS } from '@gisosteam/aol/load/wms';
import { uid } from '@gisosteam/aol/utils';
import { IFeatureType } from '@gisosteam/aol/source/IExtended';

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
  const [title, setTitle] = React.useState<string>('');
  const [serverUrl, setServerUrl] = React.useState<string>('');
  const [gisProxyUrl, setGisProxyUrl] = React.useState<string>(props.gisProxyUrl ? props.gisProxyUrl : '');
  const [selected, setSelected] = React.useState<string[]>([]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value);
  };

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

  const handleCheckboxChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked === true) {
      setSelected(selected.concat([name]));
    } else {
      setSelected(selected.filter((elem: string) => elem !== name));
    }
  };

  const handleAddButtonClick = (layersManager: LayersManager) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const types: Array<IFeatureType<string>> = [];
    selected.forEach((service: string) => {
      types.push({ id: service });
    });
    loadWMS(serverUrl, types, gisProxyUrl).then((source: ImageWms) => {
      layersManager.createAndAddLayer(Image, {
        uid: uid(),
        name: title,
        type: 'OVERLAY',
        source
      });
    });
  };

  return (
    <rolContext.Consumer>
      {context => (
        <Container>
          {capabilities == null && (
            <React.Fragment>
              <label htmlFor="serverUrl">
                {context.getLocalizedText(
                  'wmsLoader.serverUr',
                  'Enter WMS Server URL* (example: http://172.20.0.3:8080/geoserver/wms)'
                )}
              </label>
              <input id="url" type="text" value={serverUrl} onChange={handleUrlChange} />
              {(props.gisProxyUrl == null || props.gisProxyUrl === '') && (
                <React.Fragment>
                  <label htmlFor="gisProxyUrl">
                    {context.getLocalizedText(
                      'wmsLoader.gisProxyUrl',
                      'Enter Gis Proxy URL (example: http://localhost:8181)'
                    )}
                  </label>
                  <input id="gisProxyUrl" type="text" value={gisProxyUrl} onChange={handleGisProxyUrlChange} />
                </React.Fragment>
              )}
              <button onClick={handleButtonClick} disabled={serverUrl === ''}>
                {context.getLocalizedText('wmsLoader.load', 'Load capabilities')}
              </button>
            </React.Fragment>
          )}
          {capabilities != null && (
            <React.Fragment>
              <label htmlFor="title">
                {context.getLocalizedText('wmsLoader.title', 'Enter title* (required, example: WMS service)')}
              </label>
              <input id="title" type="text" value={title} onChange={handleTitleChange} />
              <LayerContainer>
                <label>{context.getLocalizedText('wmsLoader.selection', 'Select layers*')}</label>
                {capabilities.Capability.Layer.Layer.map((layer: any) => {
                  return (
                    <li key={layer.Name}>
                      <input
                        key={layer.Name}
                        id={layer.Name}
                        type="checkbox"
                        onChange={handleCheckboxChange(layer.Name)}
                        checked={selected.indexOf(layer.Name) >= 0}
                      />
                      <label htmlFor={layer.Name}>{layer.Name}</label>
                    </li>
                  );
                })}
              </LayerContainer>
              <button
                onClick={handleAddButtonClick(context.layersManager)}
                disabled={title === '' || selected.length === 0}
              >
                {context.getLocalizedText('wmsLoader.add', 'Add selected')}
              </button>
            </React.Fragment>
          )}
        </Container>
      )}
    </rolContext.Consumer>
  );
};
