import * as React from 'react';
import styled from 'styled-components';
import { IBaseWindowToolProps, BaseWindowTool, IBaseWindowToolState } from './BaseWindowTool';
import { Selector, ISelectorType } from './common/Selector';
import { WmsLoader } from './common/WmsLoader';
import { LocalVector } from '@gisosteam/aol/source/LocalVector';
import { Vector } from '../layer';
import { loadKML } from '@gisosteam/aol/load/kml';
import { loadKMZ } from '@gisosteam/aol/load/kmz';
import { loadZippedShapefile } from '@gisosteam/aol/load/shpz';
import { uid } from '@gisosteam/aol/utils';

const Container = styled.div`
  margin: 2px;
`;

export interface IBaseLayerLoaderProps extends IBaseWindowToolProps {
  /**
   * Class name.
   */
  className?: string;
  /**
   * Fixed GIS proxy url
   */
  gisProxyUrl?: string;
}

export interface IBaseLayerLoaderState extends IBaseWindowToolState {
  /**
   * Type.
   */
  type: string;
  /**
   * File.
   */
  file: File;
}

export abstract class BaseLayerLoader<
  P extends IBaseLayerLoaderProps,
  S extends IBaseLayerLoaderState
> extends BaseWindowTool<P, S> {
  public static DEFAULT_LAYER_LOADER_SELECTORS: ISelectorType[] = [
    {
      type: '.kml',
      description: 'KML (.kml)',
      showFileDropZone: true
    },
    {
      type: '.kmz',
      description: 'KMZ (.kmz)',
      showFileDropZone: true
    },
    {
      type: '.zip',
      description: 'Zipped Shapefile (.zip)',
      showFileDropZone: true
    }
  ];
  public abstract selectors: ISelectorType[];
  constructor(props: P) {
    super(props);
    this.state = {} as Readonly<S>;
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
        promise = loadKMZ(file, this.context.olMap);
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
          name: (source.getSourceOptions() as any).name,
          type: 'OVERLAY',
          source
        });
      });
    }
    this.setState({ file: null, type: null });
  };

  public renderTool(): any {
    return (
      <Container className={`${this.props.className}`}>
        {!this.state.file && (
          <Selector
            selectorTypes={this.selectors}
            onFileSelected={this.handleFileSelectorChange}
            onTypeSelected={this.handleTypeSelectorChange}
          />
        )}
        {this.state.file && <span>{this.context.getLocalizedText('layerloader.loading', 'Loading...')}</span>}
      </Container>
    );
  }
}

export class LayerLoader extends BaseLayerLoader<IBaseLayerLoaderProps, IBaseLayerLoaderState> {
  public selectors: ISelectorType[] = [
    ...BaseLayerLoader.DEFAULT_LAYER_LOADER_SELECTORS,
    {
      type: 'WMS',
      description: 'Web Map Service',
      content: <WmsLoader gisProxyUrl={this.props.gisProxyUrl} />
    }
  ];

  public renderHeaderContent(): React.ReactNode {
    const header = this.context.getLocalizedText('layerloader.title', 'Layer loader');
    return <span>{header}</span>;
  }

  public renderOpenButtonContent(): React.ReactNode {
    const button = this.context.getLocalizedText('layerloader.title', 'Layer loader');
    return <span>{button}</span>;
  }
}
