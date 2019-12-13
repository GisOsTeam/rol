import * as React from 'react';
import styled from 'styled-components';
import { IBaseButtonToolProps, BaseButtonTool } from '../tool';
import { IRolContext, rolContext } from '../RolContext';
import { LocalVector } from '@gisosteam/aol/source';
import Draw from 'ol/interaction/Draw';
import GeometryType from 'ol/geom/GeometryType';
import { getDefaultLayerStyles } from '@gisosteam/aol/utils';

const Container = styled.div`
  margin: 2px;
  display: flex;
  flex-direction: column;
`;

// unique global draw interaction
let draw: Draw = null;

export class DrawLine extends BaseButtonTool<IBaseButtonToolProps, any> {
  public static contextType: React.Context<IRolContext> = rolContext;

  public context: IRolContext;

  public toolDidActivate(): void {
    if (draw == null) {
      draw = this.buildDrawInteractionAndLayer();
      this.context.olMap.addInteraction(draw);
    }
  }

  public toolDidDeactivate(): void {
    if (draw != null) {
      this.context.olMap.removeInteraction(draw);
      draw = null;
    }
  }

  public buildDrawInteractionAndLayer(): Draw {
    const props = {
      uid: 'drawline_tool_layer',
      name: 'Line',
      layerStyles: getDefaultLayerStyles()
    };
    const localVectorSource = this.context.layersManager.createAndAddLayerFromSource(
      'LocalVector',
      {},
      props
    ) as LocalVector;
    return new Draw({
      source: localVectorSource,
      type: GeometryType.LINE_STRING
    });
  }

  public renderTool(): React.ReactNode {
    return <span>Draw line</span>;
  }
}
