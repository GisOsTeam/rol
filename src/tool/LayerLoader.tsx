import * as React from 'react';
import styled from 'styled-components';
import { IBaseWindowToolProps, BaseWindowTool, IBaseWindowToolState } from './BaseWindowTool';
import { Selector } from './common/Selector';
import { WmsLoader } from './common/WmsLoader';
import { loadKML, loadKMZ, loadZippedShapefile, uid } from '@gisosteam/aol/utils';
import { LocalVector } from '@gisosteam/aol/source';
import { Vector } from '../layer';

const Container = styled.div`
  margin: 2px;
`;

export interface ILayerLoaderProps extends IBaseWindowToolProps {
  /**
   * Class name.
   */
  className?: string;
  /**
   * Fixed GIS proxy url
   */
  gisProxyUrl?: string;
}

export interface ILayerLoaderState extends IBaseWindowToolState {
  /**
   * Type.
   */
  type: string;
  /**
   * File.
   */
  file: File;
}

export class LayerLoader extends BaseWindowTool<ILayerLoaderProps, ILayerLoaderState> {
  constructor(props: ILayerLoaderProps) {
    super(props);
    this.state = {} as Readonly<ILayerLoaderState>;
  }

  public handleTypeSelectorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      type: event.currentTarget.value
    });
  };

  public handleFileSelectorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File = event.currentTarget.files[0];
    let promise: Promise<LocalVector>;
    switch (this.state.type) {
      case '.kml':
        this.setState({ file });
        promise = loadKML(file, this.context.olMap);
        break;
      case '.kmz':
        this.setState({ file });
        promise =  loadKMZ(file, this.context.olMap);
        break;
      case '.zip':
        this.setState({ file });
        promise = loadZippedShapefile(file, this.context.olMap);
        break;
      default:
        break;
    }
    if (promise != null) {
      promise.then((source: LocalVector) => {
        this.context.layersManager.createAndAddLayer(Vector, {
          uid: uid(),
          name: source.getSourceOptions().name,
          type: 'OVERLAY',
          source
        })
      });
    }
    this.setState({ file: null, type: null });
  };

  public renderHeaderContent(): React.ReactNode {
    const header = this.context.getLocalizedText('layerloader.title', 'Layer loader');
    return <span>{header}</span>;
  }

  public renderOpenButtonContent(): React.ReactNode {
    const button = this.context.getLocalizedText('layerloader.title', 'Layer loader');
    return <span>{button}</span>;
  }

  public renderTool(): any {
    return (
      <Container className={`${this.props.className}`}>
        {!this.state.file && (
          <Selector
            selectorTypes={[
              { type: '.kml', description: 'KML (.kml)', showFileDropZone: true },
              { type: '.kmz', description: 'KMZ (.kmz)', showFileDropZone: true },
              { type: '.zip', description: 'Zipped Shapefile (.zip)', showFileDropZone: true },
              {
                type: 'WMS',
                description: 'Web Map Service',
                content: <WmsLoader gisProxyUrl={this.props.gisProxyUrl} />
              }
            ]}
            onFileSelected={this.handleFileSelectorChange}
            onTypeSelected={this.handleTypeSelectorChange}
          />
        )}
        {this.state.file && <span>{this.context.getLocalizedText('layerloader.loading', 'Loading...')}</span>}
      </Container>
    );
  }
}
