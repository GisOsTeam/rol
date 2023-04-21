import * as React from 'react';
import styled from 'styled-components';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';
import { useLayersManager } from '../hook';

const Container = styled.div`
  margin: 2px;
  display: flex;
  flex-direction: column;
`;

export type IShowsnapshotContentProps = IFunctionBaseWindowToolProps;

export function ShowsnapshotContent(props: IShowsnapshotContentProps) {
  const layersManager = useLayersManager();

  const [snapshot, setSnapshot] = React.useState<string>('');

  React.useEffect(() => {
    setSnapshot(JSON.stringify(layersManager.getSnapshot()));
  }, [props.open]);

  const handleGetButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSnapshot(JSON.stringify(layersManager.getSnapshot()));
  };

  const handleReloadButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    layersManager.reloadFromSnapshot(JSON.parse(snapshot));
  };

  const handleClearButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    layersManager.reloadFromSnapshot({ ...JSON.parse(snapshot), layers: [] });
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSnapshot(event.target.value);
  };

  return (
    <Container>
      <textarea value={snapshot} onChange={handleTextareaChange} />
      <button onClick={handleGetButtonClick}>Get snapshot from map</button>
      <button onClick={handleReloadButtonClick}>Reload map from snapshot</button>
      <button onClick={handleClearButtonClick}>Clear map</button>
    </Container>
  );
}
