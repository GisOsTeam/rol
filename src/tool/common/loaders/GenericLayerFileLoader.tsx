import * as React from 'react';
import { LocalVector } from '@gisosteam/aol/source/LocalVector';
import { loadZippedShapefile } from '@gisosteam/aol/load/shpz';
import { loadKMZ } from '@gisosteam/aol/load/kmz';
import { useTranslate } from '../../hook/useTranslate';
import { useOlMap } from '../../hook/useOlMap';
import { useLayerManager } from '../../hook/useLayerManager';
import { loadKML } from '@gisosteam/aol/load/kml';
import { Vector } from '../../../layer/Vector';
import { uid } from '@gisosteam/aol/utils';
import styled from 'styled-components';

const DropZone = styled.div`
  width: 300px;
  height: 150px;
  line-height: 150px;
  border: 2px dashed #0087f7;
  border-radius: 5px;
  background: white;
  cursor: pointer;
  color: #646c7f;
  text-align: center;
  vertical-align: middle;
`;

const DropZoneText = styled.span`
  display: inline-block;
  vertical-align: middle;
  line-height: normal;
`;

export interface IGenericLayerFileLoader {
  onFileSelected: (currentFile: File) => Promise<LocalVector>;
  accept?: string;
}

export const GenericLayerFileLoader = ({ accept, onFileSelected }: IGenericLayerFileLoader) => {
  const inputFileRef = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const translate = useTranslate();
  const layerManager = useLayerManager();

  const handleFileSelectorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentFile: File = event.currentTarget.files[0];
    setIsLoading(true);
    const promise: Promise<LocalVector> = onFileSelected(currentFile);

    promise.then((source: LocalVector) => {
      setIsLoading(false);
      layerManager.createAndAddLayer(Vector, {
        uid: uid(),
        name: (source.getSourceOptions() as any).name,
        type: 'OVERLAY',
        source,
      });
    });
  };

  if (isLoading) {
    return <span>{translate('layerloader.loading', 'Loading...')}</span>;
  } else {
    return (
      <div onClick={() => inputFileRef.current.click()}>
        <input
          ref={inputFileRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileSelectorChange}
          accept={accept}
        />
        <DropZone>
          <DropZoneText>{translate('selector.dropzone', 'Drop file here or click to upload.')}</DropZoneText>
        </DropZone>
      </div>
    );
  }
};

export const KMLFileLoader = () => {
  const olMap = useOlMap();
  const onFileSelected = (file: File) => {
    return loadKML(file, olMap);
  };
  return <GenericLayerFileLoader onFileSelected={onFileSelected} accept=".kml" />;
};

export const KMZFileLoader = () => {
  const olMap = useOlMap();
  const onFileSelected = (file: File) => {
    return loadKMZ(file, olMap);
  };
  return <GenericLayerFileLoader onFileSelected={onFileSelected} accept=".kmz" />;
};

export const ZipFileLoader = () => {
  const olMap = useOlMap();
  const onFileSelected = (file: File) => {
    return loadZippedShapefile(file, olMap);
  };
  return <GenericLayerFileLoader onFileSelected={onFileSelected} accept=".zip" />;
};
