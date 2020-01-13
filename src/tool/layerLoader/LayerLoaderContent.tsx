import * as React from 'react';
import styled from 'styled-components';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';
import { Selector, ISelectorType } from '../common/Selector';
import { WmsLoader } from '../common/WmsLoader';
import { loadKML } from '@gisosteam/aol/load/kml';
import { loadKMZ } from '@gisosteam/aol/load/kmz';
import { loadZippedShapefile } from '@gisosteam/aol/load/shpz';
import { uid } from '@gisosteam/aol/utils';
import { LocalVector } from '@gisosteam/aol/source/LocalVector';
import { Vector } from '../../layer/Vector';
import { useOlMap } from '../hook/useOlMap';
import { useTranslate } from '../hook/useTranslate';
import { useLayerManager } from '../hook/useLayerManager';

const Container = styled.div`
  margin: 2px;
`;

export interface ILayerLoaderContentProps extends IFunctionBaseWindowToolProps {
  /**
   * Fixed GIS proxy url
   */
  gisProxyUrl?: string;

  /**
   *
   */
  selectors: ISelectorType[];
}

export function LayerLoaderContent(props: ILayerLoaderContentProps) {
  const [type, setType] = React.useState<string>(null);
  const handleTypeSelectorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(event.currentTarget.value);
  };

  return (
    <Container className={`${props.className}`}>
      <Selector
        selectorTypes={props.selectors}
        selectorsProps={{ gisProxyUrl: props.gisProxyUrl }}
        onTypeSelected={handleTypeSelectorChange}
      />
    </Container>
  );
}
