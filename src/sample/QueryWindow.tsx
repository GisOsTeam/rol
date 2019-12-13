import * as React from 'react';
import OlBaseLayer from 'ol/layer/Base';
import { MapBrowserEvent } from 'ol';
import { IBaseWindowToolProps, BaseWindowTool } from '../tool';
import { IRolContext, rolContext } from '../RolContext';
import { constructQueryRequestFromPixel, IQueryResponse, IExtended } from '@gisosteam/aol/source';
import { walk } from '@gisosteam/aol/utils';

export class QueryWindow extends BaseWindowTool<IBaseWindowToolProps, any> {
  public static contextType: React.Context<IRolContext> = rolContext;

  public context: IRolContext;

  public constructor(props: IBaseWindowToolProps) {
    super(props);
    this.state = { queryResponses: null };
  }

  public toolDidActivate(): void {
    this.context.olMap.on('click', this.handleClick);
  }

  public toolDidDeactivate(): void {
    this.context.olMap.un('click', this.handleClick);
  }

  public handleClick = (e: MapBrowserEvent) => {
    this.setState({ queryResponses: null });
    const queryRequest = constructQueryRequestFromPixel(e.pixel, 2, this.context.olMap);
    const promises: Array<Promise<IQueryResponse>> = [];
    walk(this.context.olMap, (currentOlLayer: OlBaseLayer) => {
      if (currentOlLayer.getVisible() && 'getSource' in currentOlLayer) {
        const source = (currentOlLayer as any).getSource();
        if (source && 'query' in source) {
          promises.push((source as IExtended).query(queryRequest));
        }
      }
      return true;
    });
    Promise.all(promises).then(queryResponses => {
      this.setState({ queryResponses });
    });
  };

  public renderHeaderContent(): React.ReactNode {
    return <span>Query</span>;
  }

  public renderOpenButtonContent(): React.ReactNode {
    return <span>Query</span>;
  }

  public renderTool(): React.ReactNode {
    return (
      <div>
        {this.state && this.state.queryResponse && <div>{JSON.stringify(this.state.queryResponses)}</div>}
        {!this.state || (!this.state.queryResponses && <div>Click on map</div>)}
      </div>
    );
  }
}
