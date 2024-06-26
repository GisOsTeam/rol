import * as React from 'react';
import OlBaseLayer from 'ol/layer/Base';
import OlSource from 'ol/source/Source';
import { ObjectEvent } from 'ol/Object';
import { rolContext, IRolContext } from '../RolContext';
import { walk, jsonEqual } from '@gisosteam/aol/utils';
import { ISnapshotSource } from '@gisosteam/aol/source/IExtended';

let globalBaseOrder = 0;
let globalOverlayOrder = 0;
let globalWorkOrder = 0;
const orderLimit = 100000;

export interface IBaseLayerProps {
  /**
   * unique id is mandatory.
   */
  uid: string;
  /**
   * Name.
   */
  name?: string;
  /**
   * Description.
   */
  description?: string;
  /**
   * type: BASE, OVERLAY or WORK.
   */
  type?: string;
  /**
   * Extent.
   */
  extent?: [number, number, number, number];
  /**
   * Order position.
   */
  order?: number;
  /**
   * Visible.
   */
  visible?: boolean;
  /**
   * Opacity.
   */
  opacity?: number;
  /**
   * Source.
   */
  source?: ISnapshotSource;
}

export class BaseLayer<
  P extends IBaseLayerProps,
  S,
  OLL extends OlBaseLayer,
  OLS extends OlSource,
> extends React.Component<P, S> {
  public static contextType: React.Context<IRolContext> = rolContext;

  public static defaultProps = {
    type: 'OVERLAY',
  };

  public context: IRolContext;

  private olLayer: OLL = null;

  public componentDidMount() {
    this.olLayer = this.context.layersManager.getOlLayer(this.props.uid) as OLL;
    if (this.olLayer == null) {
      this.olLayer = this.createOlLayer();
    }
    this.context.layersManager.setOlLayer(this.props.uid, this.olLayer);
    this.updateProps(null, this.props);
    // Add OlLayer to map
    if (this.props.type === 'BASE') {
      this.context.olMap.addLayer(this.olLayer);
    } else {
      this.context.olGroup.getLayers().push(this.olLayer);
    }
    // Activate events
    this.internalAddEvents();
  }

  public componentDidUpdate(prevProps: P, prevState: S, snap: never) {
    this.updateProps(prevProps, this.props);
  }

  public componentWillUnmount() {
    // Remove events
    this.internalRemoveEvents();
    // Remove OlLayer to map
    walk(this.context.olMap, (currentOlLayer, idx, parent) => {
      if (currentOlLayer === this.olLayer) {
        parent.getLayers().remove(this.olLayer);
      }
      return true;
    });
    this.context.olMap.removeLayer(this.olLayer);
  }

  public createOlLayer(): OLL {
    return null;
  }

  public updateProps(prevProps: P, nextProps: P) {
    if (prevProps == null || prevProps.name !== nextProps.name) {
      this.olLayer.set('name', nextProps.name);
    }
    if (prevProps == null || prevProps.description !== nextProps.description) {
      this.olLayer.set('description', nextProps.description);
    }
    if (prevProps == null || prevProps.type !== nextProps.type) {
      let type = nextProps.type;
      if (type !== 'BASE' && type !== 'OVERLAY') {
        type = 'OVERLAY';
      }
      this.olLayer.set('type', type);
    }
    if (prevProps == null || prevProps.visible !== nextProps.visible) {
      let visible = nextProps.visible;
      if (visible == null) {
        if (nextProps.type === 'BASE') {
          visible = false;
        } else {
          visible = true;
        }
      }
      this.olLayer.setVisible(visible);
      if (nextProps.type === 'BASE') {
        this.context.layersManager.updateLayerProps(this.props.uid, { visible });
      }
    }
    if (prevProps == null || prevProps.opacity !== nextProps.opacity) {
      let opacity = nextProps.opacity;
      if (opacity !== +opacity) {
        opacity = 1;
      }
      if (opacity < 0 && opacity > 1) {
        opacity = 1;
      }
      this.olLayer.setOpacity(opacity);
    }
    if (prevProps == null || !jsonEqual(prevProps.extent, nextProps.extent)) {
      let extent = nextProps.extent;
      if (extent == null) {
        extent = undefined;
      }
      this.olLayer.setExtent(extent);
    }
    if (prevProps == null || prevProps.order !== nextProps.order || prevProps.type !== nextProps.type) {
      let order = nextProps.order;
      if (order >= orderLimit) {
        order = orderLimit - 1;
      }
      if (order < 0) {
        order = 0;
      }
      switch (nextProps.type) {
        case 'BASE':
          if (order == null || Number.isNaN(order) || order < 0) {
            order = globalBaseOrder + 1;
          }
          if (order > globalBaseOrder) {
            globalBaseOrder = order;
          }
          break;
        case 'OVERLAY':
          if (order == null || Number.isNaN(order) || order < 0) {
            order = globalOverlayOrder + 1;
          }
          if (order > globalOverlayOrder) {
            globalOverlayOrder = order;
          }
          break;
        case 'WORK':
          if (order == null || Number.isNaN(order) || order < 0) {
            order = globalWorkOrder + 1;
          }
          if (order > globalWorkOrder) {
            globalWorkOrder = order;
          }
          break;
      }
      let zIndex = order;
      if (nextProps.type === 'OVERLAY') {
        zIndex += orderLimit;
      }
      if (nextProps.type === 'WORK') {
        zIndex += 2 * orderLimit;
      }
      this.olLayer.set('order', order);
      this.olLayer.setZIndex(zIndex);
    }
  }

  public internalRemoveEvents() {
    // Unwatch events on layer
    this.olLayer.un('propertychange', this.handleBaseLayerPropertychange);
  }

  public internalAddEvents() {
    // Watch events on layer
    this.olLayer.on('propertychange', this.handleBaseLayerPropertychange);
  }

  public getOlLayer(): OLL {
    return this.olLayer;
  }

  public getOlSource(): OLS {
    if ('getSource' in this.olLayer) {
      return (this.olLayer as any).getSource();
    }
    return null;
  }

  public setOlSource(olSource: any): any {
    if ('setSource' in this.olLayer) {
      return (this.olLayer as any).setSource(olSource);
    }
  }

  private handleBaseLayerPropertychange = (event: ObjectEvent) => {
    const key = event.key;
    const value = event.target.get(key);
    if (key === 'visible' && value === true && this.props.type === 'BASE') {
      this.context.layersManager
        .getLayerElements((layerElement) => {
          const props = layerElement.reactElement.props;
          return props.type === 'BASE' && props.visible === true && layerElement.uid !== this.props.uid;
        })
        .forEach((layerElement) => {
          this.context.layersManager.updateLayerProps(layerElement.uid, { visible: false });
        });
    }
  };

  public render(): React.ReactNode {
    return null;
  }
}
