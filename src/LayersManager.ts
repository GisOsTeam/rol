import * as React from 'react';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlBaseLayer from 'ol/layer/Base';
import { BaseLayer, IBaseLayerProps } from './layer/BaseLayer';
import { Vector } from './layer/Vector';
import { Tile } from './layer/Tile';
import { Image } from './layer/Image';
import { VectorTile } from './layer/VectorTile';
import { IWMSService } from './layer/IWMSService';
import { FileTypeEnum } from './layer/FileTypeEnum';
import { jsonEqual, walk, createSource, uid as genUid } from '@gisosteam/aol/utils';
import { ISnapshot, ISnapshotLayer, ISnapshotProjection } from '@gisosteam/aol/ISnapshot';
import { IExtended, IFeatureType } from '@gisosteam/aol/source/IExtended';
import { getProjectionInfos, addProjection } from '@gisosteam/aol/ProjectionInfo';
import { SourceTypeEnum } from '@gisosteam/aol/source/types/sourceType';
import { LayerTypeEnum } from '@gisosteam/aol/source/types/layerType';
import Layer from 'ol/layer/Layer';
import { loadWMS } from '@gisosteam/aol/load/wms';
import { loadZippedShapefile } from '@gisosteam/aol/load/shpz';
import { loadKML } from '@gisosteam/aol/load/kml';
import { loadKMZ } from '@gisosteam/aol/load/kmz';

export type layerElementStatus = null | 'react' | 'ext' | 'del';

export interface ILayerElement {
  /**
   * React Element.
   */
  reactElement: Readonly<React.ReactElement>;
  /**
   * Unique id.
   */
  uid: string;
  /**
   * Updated props.
   */
  updatedProps: any;
  /**
   * Status.
   */
  status: Readonly<layerElementStatus>;
  /**
   * Openlayers layer.
   */
  olLayer?: OlBaseLayer;
}

const layerMaps = new Map<string, Map<string, ILayerElement>>();

export class LayersManager {
  private uid: string;

  private olMap: OlMap;

  private refresh: () => void;

  constructor(uid: string, olMap: OlMap, refresh: () => void) {
    this.uid = uid;
    this.olMap = olMap;
    this.refresh = refresh;
    layerMaps.set(uid, new Map<string, ILayerElement>());
  }

  /**
   * Get Openlayers map.
   */
  public getOlMap(): OlMap {
    return this.olMap;
  }

  /**
   * Get snapshot.
   */
  public getSnapshot = (): ISnapshot => {
    // View
    const olView = this.olMap.getView();
    const view = {
      center: olView.getCenter() as [number, number],
      zoom: olView.getZoom(),
      projectionCode: olView.getProjection().getCode()
    };
    // Projections
    const projections: ISnapshotProjection[] = [];
    getProjectionInfos().map(projectionInfo => {
      projections.push({
        code: projectionInfo.code,
        name: projectionInfo.name,
        lonLatValidity: projectionInfo.lonLatValidity,
        remarks: projectionInfo.remarks,
        wkt: projectionInfo.wkt
      });
    });
    // Layers
    const layers: ISnapshotLayer[] = [];
    this.getLayerElements().map(layerElement => {
      const props = { ...layerElement.reactElement.props };
      const source = props.source;
      if (source != null && 'getSourceType' in source && 'getSourceOptions' in source && 'isSnapshotable' in source) {
        if ((source as IExtended).isSnapshotable()) {
          props.source = undefined;
          props.children = undefined;
          layers.push({
            sourceType: (source as IExtended).getSourceType(),
            sourceOptions: (source as IExtended).getSourceOptions(),
            props
          });
        }
      }
    });
    return {
      view,
      projections,
      layers
    };
  };

  /**
   * Load & Add a WMS Service
   * @param service
   * @param proxy
   * @returns New Layer's uid
   */
  public async addWMS({ id, serverURL, name, description }: IWMSService, proxy?: string): Promise<string> {
    const types: Array<IFeatureType<string>> = [];
    types.push({ id });
    const extended = await loadWMS(serverURL + '/wms', types, proxy);
    return this.addServiceFromSource(extended, name, description);
  }

  /**
   * Load file and add service
   * @param file
   * @param type FileTypeEnum.KML | KMZ | ZIP
   * @returns New Layer's uid
   */
  public addServiceFromFile(file: File, type: FileTypeEnum): Promise<string> {
    let promise: Promise<IExtended>;
    switch (type) {
      case FileTypeEnum.ZIP:
        promise = loadZippedShapefile(file, this.olMap);
        break;
      case FileTypeEnum.KML:
        promise = loadKML(file, this.olMap);
        break;
      case FileTypeEnum.KMZ:
        promise = loadKMZ(file, this.olMap);
        break;
      default:
        console.warn(`ROL LayerManager addServiceFromFile -- ServiceType ${type} can't be loaded from a file`);
        return null;
    }
    return promise.then(extended => this.addServiceFromSource(extended));
  }

  /**
   * Add a service from a source
   * @param source
   * @param name
   * @param description
   * @returns uid of the Layer
   */
  public addServiceFromSource(source: IExtended, name?: string, description?: string): string {
    const uid = genUid();
    this.createAndAddLayer(Image, {
      uid,
      name,
      description,
      type: 'OVERLAY',
      source
    });
    return uid;
  }

  /**
   * Reload from snapshot.
   */
  public reloadFromSnapshot = (snapshot: ISnapshot) => {
    // Remove old
    this.getLayerElements().map(layerElement => {
      this.setLayerElement(
        {
          ...layerElement,
          status: 'del'
        },
        false
      );
    });
    // Projections
    snapshot.projections.forEach(projection => {
      addProjection(projection.code, projection.wkt, projection.lonLatValidity, projection.name, projection.remarks);
    });
    // View
    this.olMap.setView(
      new OlView({
        center: snapshot.view.center,
        zoom: snapshot.view.zoom,
        projection: snapshot.view.projectionCode
      })
    );
    // Layers
    snapshot.layers.forEach(layer => {
      this.createAndAddLayerFromSourceDefinition(layer.sourceType, layer.sourceOptions, layer.props);
    });
    // Refresh
    this.refresh();
  };

  /**
   * Get infoElements
   */
  public getLayerElements(
    filterFn?: (value: ILayerElement, index: number, array: ILayerElement[]) => boolean,
    thisFilterArg?: any
  ): ILayerElement[] {
    const layerMap = layerMaps.get(this.uid);
    if (layerMap == null) {
      return [];
    }
    const arr = Array.from(layerMap.values()).filter(layerElement => layerElement.status !== 'del');
    return filterFn == null ? arr : arr.filter(filterFn, thisFilterArg);
  }

  public getLayerElementFromSource(source: IExtended): ILayerElement {
    const layerElement = this.getLayerElements((layerElement: ILayerElement) => {
      return layerElement.olLayer != null && (layerElement.olLayer as Layer).getSource() === source;
    }).pop();
    if (layerElement != null) {
      return layerElement;
    } else {
      console.error(`Element not found for source ${source}`);
      return null;
    }
  }

  public getLayerElementByUID(uid: string): ILayerElement {
    return this.getLayerElements(le => le.uid === uid).pop();
  }

  /**
   * Update layer props
   */
  public updateLayerProps(uid: string, props: any, refreshIfChanging = true) {
    const layerElement = this.getLayerElements(layerElement => layerElement.uid == uid).pop();
    if (layerElement != null) {
      this.setLayerElement(
        {
          ...layerElement,
          reactElement: React.cloneElement(layerElement.reactElement, {
            ...layerElement.reactElement.props,
            ...props,
            uid,
            key: uid
          }),
          updatedProps: { ...layerElement.updatedProps, ...props }
        },
        refreshIfChanging
      );
    } else {
      console.error(`Element not found for uid ${uid}`);
    }
  }

  /**
   * Set Openlayers layer
   */
  public setOlLayer(uid: string, olLayer: OlBaseLayer) {
    const layerElement = this.getLayerElements(layerElement => layerElement.uid == uid).pop();
    if (layerElement != null) {
      layerElement.olLayer = olLayer;
      layerElement.olLayer.set('uid', uid, true);
    } else {
      console.error(`Element not found for uid ${uid}`);
    }
  }

  /**
   * Get Openlayers layer
   */
  public getOlLayer(uid: string): OlBaseLayer {
    const layerElement = this.getLayerElements(layerElement => layerElement.uid == uid).pop();
    if (layerElement != null) {
      return layerElement.olLayer;
    } else {
      console.error(`Element not found for uid ${uid}`);
      return null;
    }
  }

  /**
   * Remove layer
   */
  public removeLayer(uid: string) {
    const layerElement = this.getLayerElements(layerElement => layerElement.uid == uid).pop();
    if (layerElement != null) {
      layerElement.status = 'del';
    }
  }

  /**
   * Create and add layer props
   */
  public createAndAddLayer(
    cl: React.ClassType<IBaseLayerProps, BaseLayer<IBaseLayerProps, any, any, any>, any>,
    props: IBaseLayerProps
  ) {
    const reactElement = React.createElement(cl, {
      ...props,
      key: props.uid
    });
    this.setLayerElement({
      reactElement,
      uid: props.uid,
      updatedProps: {},
      status: 'ext'
    });
  }

  /**
   * Create and add layer props
   */
  public createAndAddLayerFromSourceDefinition(
    sourceType: SourceTypeEnum,
    sourceOptions: any,
    props: IBaseLayerProps
  ): IExtended {
    const layerElement = this.getLayerElements(layerElement => layerElement.uid == props.uid).pop();
    if (layerElement != null) {
      if (layerElement.olLayer != null) {
        return 'getSource' in layerElement.olLayer ? (layerElement.olLayer as any).getSource() : null;
      } else {
        let found: OlBaseLayer;
        walk(this.olMap, (currentOlLayer: OlBaseLayer) => {
          if (currentOlLayer.get('uid') === props.uid) {
            this.setOlLayer(props.uid, currentOlLayer);
            found = currentOlLayer;
          }
          return true;
        });
        let source = null;
        if ('getSource' in found) {
          const source = (found as any).getSource();
          // Update source
          source.setSourceOptions(sourceOptions);
          return source;
        } else {
          return null;
        }
      }
    }
    const source = createSource(sourceType, sourceOptions);
    switch (source.getLayerType()) {
      case LayerTypeEnum.Image:
        this.createAndAddLayer(Image, { ...props, source });
        break;
      case LayerTypeEnum.Tile:
        this.createAndAddLayer(Tile, { ...props, source });
        break;
      case LayerTypeEnum.Vector:
        this.createAndAddLayer(Vector, { ...props, source });
        break;
      case LayerTypeEnum.VectorTile:
        this.createAndAddLayer(VectorTile, { ...props, source });
        break;
      /*case LayerTypeEnum.Heatmap:
        this.createAndAddLayer(VectorTile, { ...props, source });
        break;*/
    }
    return source;
  }

  /**
   * Update from children
   */
  public fromChildren(nextChildren: React.ReactNode) {
    const layerMap = layerMaps.get(this.uid);
    if (layerMap == null) {
      return;
    }
    const toDel = new Set<string>();
    // Old children
    this.getLayerElements(layerElement => layerElement.status === 'react').map(layerElement => {
      toDel.add(layerElement.uid);
    });
    // Next children
    if (nextChildren) {
      React.Children.map(nextChildren, (nextChild: React.ReactElement<any>) => {
        if (nextChild != null && BaseLayer.isPrototypeOf(nextChild.type)) {
          const uid = nextChild.props.uid;
          // uid is null: log error
          if (uid == null) {
            console.error('Unique id is mandatory');
          } else {
            const layerElement = layerMap.get(uid);
            if (layerElement == null || layerElement.status === 'react') {
              if (toDel.has(uid)) {
                toDel.delete(uid);
              }
              const props = {
                ...nextChild.props,
                ...(layerElement != null ? layerElement.updatedProps : {}),
                key: uid
              };
              this.setLayerElement({
                reactElement: React.cloneElement(nextChild, props),
                status: 'react',
                updatedProps: layerElement != null ? layerElement.updatedProps : {},
                uid
              });
              if (layerElement != null) {
                this.setOlLayer(uid, layerElement.olLayer);
              }
            }
          }
        }
      });
    }
    // Set status to 'del' removed children
    toDel.forEach((uid: string) => {
      const layerElement = this.getLayerElements(layerElement => layerElement.uid == uid).pop();
      if (layerElement != null) {
        layerElement.status = 'del';
      }
    });
  }

  /**
   * Set layerElement
   */
  private setLayerElement(layerElement: ILayerElement, refreshIfChanging = true) {
    const layerMap = layerMaps.get(this.uid);
    if (layerMap == null) {
      return false;
    }
    const found = layerMap.get(layerElement.uid);
    let changed = false;
    if (!found) {
      if (layerElement.status !== 'del') {
        layerMap.set(layerElement.uid, {
          ...layerElement
        });
        changed = true;
      }
    } else {
      if (layerElement.status === 'del') {
        if (found.status === 'react') {
          layerMap.set(layerElement.uid, {
            ...layerElement,
            status: 'del'
          });
          changed = true;
        } else if (found.status === 'ext') {
          layerMap.delete(layerElement.uid);
          changed = true;
        }
      } else {
        layerMap.set(layerElement.uid, {
          ...layerElement
        });
        changed = !jsonEqual(found.reactElement.props, layerElement.reactElement.props, ['source', 'children']);
      }
    }
    if (refreshIfChanging && changed) {
      this.refresh();
    }
  }
}
