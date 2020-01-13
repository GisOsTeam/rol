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
  const [file, setFile] = React.useState<File>(null);
  const [type, setType] = React.useState<string>(null);
  const olMap = useOlMap();
  const translate = useTranslate();
  const layerManager = useLayerManager();

  const handleTypeSelectorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(event.currentTarget.value);
  };

  const handleFileSelectorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentFile: File = event.currentTarget.files[0];
    let promise: Promise<LocalVector>;
    switch (type) {
      case '.kml':
        setFile(currentFile);
        promise = loadKML(currentFile, olMap);
        break;
      case '.kmz':
        setFile(currentFile);
        promise = loadKMZ(currentFile, olMap);
        break;
      case '.zip':
        setFile(currentFile);
        promise = loadZippedShapefile(currentFile, olMap);
        break;
      default:
        break;
    }
    if (promise != null) {
      promise.then((source: LocalVector) => {
        layerManager.createAndAddLayer(Vector, {
          uid: uid(),
          name: (source.getSourceOptions() as any).name,
          type: 'OVERLAY',
          source
        });
      });
    }
    setFile(null);
    setType(null);
  };

  return (
    <Container className={`${props.className}`}>
      {!file && (
        <Selector
          selectorTypes={props.selectors}
          onFileSelected={handleFileSelectorChange}
          onTypeSelected={handleTypeSelectorChange}
        />
      )}
      {file && <span>{translate('layerloader.loading', 'Loading...')}</span>}
    </Container>
  );
}
