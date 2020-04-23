import * as React from 'react';
import OlMap from 'ol/Map';
import { Extent } from 'ol/extent';
import { MapEvent } from 'ol';

export class ViewManager {
  private uid: string;
  private olMap: OlMap;
  private refresh: () => void;

  private currentExtent: Extent;
  private futureExtends: Extent[] = [];
  private pastExtends: Extent[] = [];
  private shouldUpdate: boolean = true;

  constructor(uid: string, olMap: OlMap, refresh: () => void) {
    this.uid = uid;
    this.olMap = olMap;
    this.refresh = refresh;
    this.currentExtent = olMap.getView().calculateExtent();
    this.olMap.on('moveend', this.updateExtends.bind(this));
  }
  public unregister() {
    this.olMap.un('moveend', this.updateExtends.bind(this));
  }

  public fitToPrevious = () => {
    const { pastExtends } = this;
    if (pastExtends.length > 0) {
      this.shouldUpdate = false;
      this.olMap.getView().fit(pastExtends[pastExtends.length - 1], {
        callback: this.onPastFitEnd.bind(this)
      });
    }
  };

  public fitToNext = () => {
    const { futureExtends } = this;

    if (futureExtends.length > 0) {
      this.shouldUpdate = false;
      this.olMap.getView().fit(futureExtends[0], {
        callback: this.onFutureFitEnd.bind(this)
      });
    }
  };

  private updateExtends(evt: MapEvent) {
    if (this.shouldUpdate) {
      const { frameState } = evt;
      const { pastExtends, currentExtent, futureExtends } = this;
      this.pastExtends = [...pastExtends, currentExtent];
      this.currentExtent = frameState.extent;
      this.futureExtends = [];

      console.log('New Extent', { pastExtends, currentExtent, futureExtends });
    }
  }

  private onPastFitEnd() {
    const { pastExtends, currentExtent, futureExtends } = this;
    const newPastExtends = [...pastExtends];
    const newExtent = newPastExtends.pop();
    const newFutureExtends = [currentExtent, ...futureExtends];

    this.currentExtent = newExtent;
    this.pastExtends = newPastExtends;
    this.futureExtends = newFutureExtends;
    this.shouldUpdate = true;
  }

  private onFutureFitEnd() {
    const { pastExtends, currentExtent, futureExtends } = this;
    const newPastExtends = [...pastExtends];
    const newExtent = newPastExtends.pop();
    const newFutureExtends = [currentExtent, ...futureExtends];

    this.currentExtent = newExtent;
    this.pastExtends = newPastExtends;
    this.futureExtends = newFutureExtends;
    this.shouldUpdate = true;
  }
}
