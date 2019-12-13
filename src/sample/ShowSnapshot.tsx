import * as React from 'react';
import styled from 'styled-components';
import { IBaseWindowToolProps, BaseWindowTool } from '../tool';
import { IRolContext, rolContext } from '../RolContext';

const Container = styled.div`
  margin: 2px;
  display: flex;
  flex-direction: column;
`;

export class ShowSnapshot extends BaseWindowTool<IBaseWindowToolProps, any> {
  public static contextType: React.Context<IRolContext> = rolContext;

  public context: IRolContext;

  constructor(props: IBaseWindowToolProps) {
    super(props);
    this.state = { snapshot: '' };
  }

  public toolDidActivate() {
    const snapshot = JSON.stringify(this.context.layersManager.getSnapshot());
    this.setState({ snapshot });
  }

  public handleGetButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const snapshot = JSON.stringify(this.context.layersManager.getSnapshot());
    this.setState({ snapshot });
  };

  public handleReloadButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const snapshot = JSON.parse(this.state.snapshot);
    this.context.layersManager.reloadFromSnapshot(snapshot);
  };

  public handleClearButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const clearSnapshot = { ...JSON.parse(this.state.snapshot), layers: [] };
    this.context.layersManager.reloadFromSnapshot(clearSnapshot);
  };

  public handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ snapshot: event.target.value });
  };

  public renderHeaderContent(): React.ReactNode {
    return <span>Show snapshot</span>;
  }

  public renderOpenButtonContent(): React.ReactNode {
    return <span>Show snapshot</span>;
  }

  public renderTool(): React.ReactNode {
    return (
      <Container>
        <textarea value={this.state.snapshot} onChange={this.handleTextareaChange} />
        <button onClick={this.handleGetButtonClick}>Get snapshot from map</button>
        <button onClick={this.handleReloadButtonClick}>Reload map from snapshot</button>
        <button onClick={this.handleClearButtonClick}>Clear map</button>
      </Container>
    );
  }
}
