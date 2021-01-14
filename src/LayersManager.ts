import * as React from 'react';
import OlMap from 'ol/Map';
import OlView from 'ol/View';
import OlBaseLayer from 'ol/layer/Base';
import { BaseLayer, IBaseLayerProps } from './layer/BaseLayer';
import { Vector } from './layer/Vector';
import { Tile } from './layer/Tile';
import { Image } from './layer/Image';
import { VectorTile } from './layer/VectorTile';
import { jsonEqual, walk, createSource } from '@gisosteam/aol/utils';
import { ISnapshot, ISnapshotLayer, ISnapshotProjection } from '@gisosteam/aol/ISnapshot';
import { ISnapshotSource, IFeatureType } from '@gisosteam/aol/source/IExtended';
import { getProjectionInfos, addProjection } from '@gisosteam/aol/ProjectionInfo';
import { SourceTypeEnum } from '@gisosteam/aol/source/types/sourceType';
import { LayerTypeEnum } from '@gisosteam/aol/source/types/layerType';
import Layer from 'ol/layer/Layer';

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
      projectionCode: olView.getProjection().getCode(),
      constrainResolution: olView.getConstrainResolution(),
    };
    // Projections
    const projections: ISnapshotProjection[] = [];
    getProjectionInfos().map((projectionInfo) => {
      projections.push({
        code: projectionInfo.code,
        name: projectionInfo.name,
        lonLatValidity: projectionInfo.lonLatValidity,
        remarks: projectionInfo.remarks,
        wkt: projectionInfo.wkt,
      });
    });
    // Layers
    const layers: ISnapshotLayer[] = [];
    this.getLayerElements().map((layerElement) => {
      const props = { ...layerElement.reactElement.props };
      const source = props.source;
      if (source != null) {
        if (typeof source.isSnapshotable === 'function' && (source as ISnapshotSource).isSnapshotable()) {
          props.source = undefined;
          props.children = undefined;
          layers.push({
            sourceType: (source as ISnapshotSource).getSourceType(),
            sourceOptions: (source as ISnapshotSource).getSourceOptions(),
            props,
          });
        }
      }
    });
    return {
      view,
      projections,
      layers,
    };
  };

  /**
   * Reload layers.
   */
  public reload(): Promise<void> {
    return this.reloadFromSnapshot(this.getSnapshot());
  }

  /**
   * Reload from snapshot.
   */
  public reloadFromSnapshot(snapshot: ISnapshot): Promise<void> {
    // Remove old
    this.getLayerElements().map((layerElement) => {
      this.setLayerElement(
        {
          ...layerElement,
          status: 'del',
        },
        false
      );
    });
    // Projections
    snapshot.projections.forEach((projection) => {
      addProjection(projection.code, projection.wkt, projection.lonLatValidity, projection.name, projection.remarks);
    });
    // View
    this.olMap.setView(
      new OlView({
        center: snapshot.view.center,
        zoom: snapshot.view.zoom,
        projection: snapshot.view.projectionCode,
        constrainResolution: snapshot.view.constrainResolution,
      })
    );
    // Refresh
    this.refresh();
    return new Promise((resolve) => {
      setTimeout(() => {
        // Layers
        snapshot.layers.forEach((layer) => {
          this.createAndAddLayerFromSourceDefinition(layer.sourceType, layer.sourceOptions, layer.props);
        });
        // Refresh
        this.refresh();
        // Resolv
        resolve();
      }, 100);
    });
  }

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
    const arr = Array.from(layerMap.values()).filter((layerElement) => layerElement.status !== 'del');
    return filterFn == null ? arr : arr.filter(filterFn, thisFilterArg);
  }

  public getLayerElementFromSource(source: ISnapshotSource): ILayerElement {
    const layerElement = this.getLayerElements((layerElement: ILayerElement) => {
      return layerElement.reactElement.props.source === source;
    }).pop();
    if (layerElement != null) {
      return layerElement;
    } else {
      console.error(`Element not found for source ${source}`);
      return null;
    }
  }

  public getLayerElementByUID(uid: string): ILayerElement {
    return this.getLayerElements((le) => le.uid === uid).pop();
  }

  /**
   * Update layer props
   */
  public updateLayerProps(uid: string, props: any, refreshIfChanging = true) {
    const layerElement = this.getLayerElements((layerElement) => layerElement.uid == uid).pop();
    if (layerElement != null) {
      this.setLayerElement(
        {
          ...layerElement,
          reactElement: React.cloneElement(layerElement.reactElement, {
            ...layerElement.reactElement.props,
            ...props,
            uid,
            key: uid,
          }),
          updatedProps: { ...layerElement.updatedProps, ...props },
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
    const layerElement = this.getLayerElements((layerElement) => layerElement.uid == uid).pop();
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
    const layerElement = this.getLayerElements((layerElement) => layerElement.uid == uid).pop();
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
    const layerElement = this.getLayerElements((layerElement) => layerElement.uid == uid).pop();
    if (layerElement != null) {
      this.setLayerElement({
        reactElement: layerElement.reactElement,
        uid,
        updatedProps: {},
        status: 'del',
      });
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
      key: props.uid,
    });
    this.setLayerElement({
      reactElement,
      uid: props.uid,
      updatedProps: {},
      status: 'ext',
    });
  }

  /**
   * Create and add layer props
   */
  public createAndAddLayerFromSource(source: ISnapshotSource, props: IBaseLayerProps): ISnapshotSource {
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
   * Create and add layer props
   */
  public createAndAddLayerFromSourceDefinition(
    sourceType: SourceTypeEnum,
    sourceOptions: any,
    props: IBaseLayerProps
  ): ISnapshotSource {
    const layerElement = this.getLayerElements((layerElement) => layerElement.uid == props.uid).pop();
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
    this.createAndAddLayerFromSource(source, props);
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
    this.getLayerElements((layerElement) => layerElement.status === 'react').map((layerElement) => {
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
                key: uid,
              };
              this.setLayerElement({
                reactElement: React.cloneElement(nextChild, props),
                status: 'react',
                updatedProps: layerElement != null ? layerElement.updatedProps : {},
                uid,
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
      const layerElement = this.getLayerElements((layerElement) => layerElement.uid == uid).pop();
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
          ...layerElement,
        });
        changed = true;
      }
    } else {
      if (layerElement.status === 'del') {
        if (found.status === 'react' || found.status === 'ext') {
          layerMap.set(layerElement.uid, {
            ...layerElement,
            status: 'del',
          });
          changed = true;
        }
      } else {
        layerMap.set(layerElement.uid, {
          ...layerElement,
        });
        changed = !jsonEqual(found.reactElement.props, layerElement.reactElement.props, ['source', 'children']);
      }
    }
    if (refreshIfChanging && changed) {
      this.refresh();
    }
  }
}
