import * as React from 'react';
import styled from 'styled-components';
import { rolContext, IRolContext } from '../RolContext';
import { BaseTool, IBaseToolProps } from './BaseTool';

const Container = styled.div`
  top: 46px;
  left: 47px;
  width: 96px;
`;

const ButtonFullscreen = styled.button`
  height: 32px;
  width: 32px;
  background-color: rgba(213, 213, 213, 0.61);
  border-style: solid;
  border-color: rgba(172, 172, 172, 0.61);
  color: #242424;
  box-shadow: none;
  border-width: 1px 1px 1px 1px !important;
  border-radius: 5px 5px 5px 5px !important;
  ::after {
    content: '⛶';
  }
`;

export class Fullscreen extends BaseTool<IBaseToolProps, any> {
  public static contextType: React.Context<IRolContext> = rolContext;

  public static defaultProps = {
    ...BaseTool.defaultProps
  };

  public context: IRolContext;

  public handleToggleFullscreen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (this.isFullscreen()) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  };

  public isFullscreen(): boolean {
    return !!(
      (document as any).webkitIsFullScreen ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).fullscreenElement
    );
  }

  public enterFullscreen() {
    const elem = this.context.olMap.getTargetElement() as any;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    }
  }

  public exitFullscreen() {
    if ((document as any).exitFullscreen) {
      (document as any).exitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    }
  }

  public renderTool(): React.ReactNode {
    if (this.props.disabled === true) {
      return null;
    }
    const fullscreenTitle = this.context.translate('panzoom.rotate', 'Toggle full-screen');
    return (
      <Container className={`${this.props.className} ol-unselectable ol-control`}>
        <ButtonFullscreen
          className={`${this.props.className}-fullscreen`}
          onClick={this.handleToggleFullscreen}
          title={fullscreenTitle}
        />
      </Container>
    );
  }
}
