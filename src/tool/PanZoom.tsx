import * as React from 'react';
import styled from 'styled-components';
import OlView from 'ol/View';
import { inAndOut } from 'ol/easing';
import { cloneView } from '@gisosteam/aol/utils';
import { rolContext, IRolContext } from '../RolContext';
import { BaseTool, IBaseToolProps } from './BaseTool';

const Container = styled.div``;

const Button = styled.button`
  height: 32px;
  width: 32px;
  background-color: rgba(213, 213, 213, 0.61);
  border-style: solid;
  border-color: rgba(172, 172, 172, 0.61);
  color: #242424;
  box-shadow: none;
`;

const ButtonUp = styled(Button)`
  display: block;
  margin-left: 32px;
  border-width: 1px 1px 0px 1px !important;
  border-radius: 5px 5px 0px 0px !important;
  ::after {
    content: '↑';
  }
`;

const ButtonLeft = styled(Button)`
  display: inline;
  margin-left: 0px;
  border-width: 1px 0px 1px 1px !important;
  border-radius: 5px 0px 0px 5px !important;
  ::after {
    content: '←';
  }
`;

const ButtonOrigin = styled(Button)`
  display: inline;
  border-width: 0px !important;
  border-radius: 0px !important;
  ::after {
    content: '⤢';
  }
`;

const ButtonNoorigin = styled(Button)`
  display: inline;
  border-width: 0px !important;
  border-radius: 0px !important;
  ::after {
    content: '.';
  }
`;

const ButtonRight = styled(Button)`
  display: inline;
  border-width: 1px 1px 1px 0px !important;
  border-radius: 0px 5px 5px 0px !important;
  ::after {
    content: '→';
  }
`;

const ButtonDown = styled(Button)`
  display: block;
  margin-left: 32px;
  border-width: 0px 1px 1px 1px !important;
  border-radius: 0px 0px 5px 5px !important;
  ::after {
    content: '↓';
  }
`;

const ButtonZoom = styled(Button)`
  display: block;
  margin-top: 2px;
  margin-left: 32px;
  border-width: 1px 1px 0px 1px !important;
  border-radius: 5px 5px 0px 0px !important;
  ::after {
    content: '+';
  }
`;

const ButtonUnzoom = styled(Button)`
  display: block;
  margin-left: 32px;
  border-width: 0px 1px 1px 1px !important;
  border-radius: 0px 0px 5px 5px !important;
  ::after {
    content: '-';
  }
`;

const ButtonRotate = styled(Button)`
  display: block;
  margin-top: 2px;
  margin-left: 32px;
  border-width: 1px 1px 1px 1px !important;
  border-radius: 5px 5px 5px 5px !important;
`;

const SpanRotate = styled.span`
  ::after {
    content: '⇑';
  }
`;

const DivSlider = styled.div`
  margin-left: 32px;
  width: 30px;
  height: 100px;
  background-color: rgba(213, 213, 213, 0.61);
  border-style: solid;
  border-color: rgba(172, 172, 172, 0.61);
  border-width: 1px 1px 1px 1px !important;
`;

const ButtonSliderThumb = styled(Button)`
  position: relative;
  width: 28px !important;
  left: 1px !important;
  height: 10px !important;
  background-color: #242424 !important;
`;

export interface IPanZoomProps extends IBaseToolProps {
  /**
   * Class name.
   */
  className?: string;
  /**
   * Show Zoom
   */
  showZoom?: boolean;
  /**
   * Show Zoom Slider
   */
  showZoomSlider?: boolean;
  /**
   * Show Pan
   */
  showPan?: boolean;
  /**
   * Show Origin
   */
  showOrigin?: boolean;
  /**
   * Show Rotation
   */
  showRotation?: boolean;
}

export class PanZoom extends BaseTool<IPanZoomProps, any> {
  public static defaultProps = {
    ...BaseTool.defaultProps,
    className: 'panzoom',
    showZoom: true,
    showZoomSlider: true,
    showPan: true,
    showOrigin: true,
    showRotation: true,
  };

  public static contextType: React.Context<IRolContext> = rolContext;

  public context: IRolContext;

  /**
   * Origin.
   */
  private origin: OlView;

  /**
   * Button Rotate.
   */
  private buttonRotate: HTMLButtonElement;

  /**
   * Div Rotate.
   */
  private divRotate: HTMLDivElement;

  /**
   * Container thumb.
   */
  private containerThumb: HTMLDivElement;

  /**
   * Btn thumb.
   */
  private btnThumb: any;

  public toolDidConstruct() {
    setTimeout(() => {
      this.origin = cloneView(this.context.olMap.getView());
      this.onViewChange();
    }, 100);
    this.context.olMap.on('change:view', this.onViewChange);
    this.context.olMap.on('postrender', (event: any) => {
      const frameState = event.frameState;
      if (frameState == null) {
        return;
      }
      const viewState = frameState.viewState;
      if (viewState == null) {
        return;
      }
      const rotation = viewState.rotation;
      if (this.buttonRotate != null) {
        if (rotation != null && rotation !== 0) {
          this.buttonRotate.style.display = '';
          const transform = 'rotate(' + rotation + 'rad)';
          this.divRotate.style.webkitTransform = transform;
          this.divRotate.style.transform = transform;
        } else {
          this.buttonRotate.style.display = 'none';
        }
      }
    });
  }

  public onViewChange = () => {
    this.context.olMap.getView().on('propertychange', this.onResolutionChange);
    this.onResolutionChange();
  };

  public onResolutionChange = () => {
    if (this.btnThumb == null) {
      return;
    }
    const view = this.context.olMap.getView();
    const resolution = view.getResolution();
    const position = 1 - view.getValueForResolutionFunction()(resolution);
    const computedBtnThumbStyle = window.getComputedStyle(this.btnThumb);
    const btnThumbHeight =
      this.btnThumb.offsetHeight +
      parseFloat(computedBtnThumbStyle['marginTop']) +
      parseFloat(computedBtnThumbStyle['marginBottom']) +
      1;
    this.btnThumb.style.top = (this.containerThumb.offsetHeight - btnThumbHeight) * position - btnThumbHeight + 'px';
  };

  public handleZoomButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.zoom(1);
  };

  public handleUnzoomButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.zoom(-1);
  };

  public handleOriginButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (this.origin) {
      this.context.olMap.setView(cloneView(this.origin));
    }
  };

  public handleLeftButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.handleResetRotationButtonClick(event);
    this.pan(-128, 0);
  };

  public handleRightButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.handleResetRotationButtonClick(event);
    this.pan(128, 0);
  };

  public handleUpButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.handleResetRotationButtonClick(event);
    this.pan(0, 128);
  };

  public handleDownButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.handleResetRotationButtonClick(event);
    this.pan(0, -128);
  };

  public handleResetRotationButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const view = this.context.olMap.getView();
    if (view.getRotation() !== undefined) {
      if (view.getAnimating()) {
        view.cancelAnimations();
      }
      view.animate({
        rotation: 0,
        duration: 200,
        easing: inAndOut,
      });
    }
  };

  public pan(deltaX: number, deltaY: number) {
    const view = this.context.olMap.getView();
    const res = view.getResolution();
    const center = view.getCenter();
    center[0] += res * deltaX;
    center[1] += res * deltaY;
    if (view.getAnimating()) {
      view.cancelAnimations();
    }
    view.animate({
      center,
      duration: 200,
      easing: inAndOut,
    });
  }

  public zoom(delta: number) {
    const view = this.context.olMap.getView();
    const zoom = view.getZoom();
    if (view.getAnimating()) {
      view.cancelAnimations();
    }
    view.animate({
      zoom: (view as any).getConstrainedZoom(zoom + delta),
      duration: 200,
      easing: inAndOut,
    });
  }

  public renderPan(): React.ReactNode {
    if (!this.props.showPan) {
      return null;
    }
    const upTitle = this.context.translate('panzoom.up', 'Pan up');
    const downTitle = this.context.translate('panzoom.down', 'Pan down');
    const rightTitle = this.context.translate('panzoom.right', 'Pan right');
    const leftTitle = this.context.translate('panzoom.left', 'Pan left');
    const originTitle = this.context.translate('panzoom.origin', 'Zoom origin');
    let origin = null;
    if (this.props.showOrigin) {
      origin = (
        <ButtonOrigin
          className={`${this.props.className}-origin`}
          onClick={this.handleOriginButtonClick}
          title={originTitle}
        />
      );
    } else {
      origin = <ButtonNoorigin className={`${this.props.className}-noorigin`} disabled />;
    }
    return (
      <div className="ol-unselectable ol-control" style={{ top: '86px', left: '15px' }}>
        <ButtonUp className={`${this.props.className}-up`} onClick={this.handleUpButtonClick} title={upTitle} />
        <ButtonLeft className={`${this.props.className}-left`} onClick={this.handleLeftButtonClick} title={leftTitle} />
        {origin}
        <ButtonRight
          className={`${this.props.className}-right`}
          onClick={this.handleRightButtonClick}
          title={rightTitle}
        />
        <ButtonDown className={`${this.props.className}-down`} onClick={this.handleDownButtonClick} title={downTitle} />
      </div>
    );
  }

  public renderZoom(): React.ReactNode {
    if (!this.props.showZoom) {
      return null;
    }
    const zoomTitle = this.context.translate('panzoom.zoom', 'Zoom in');
    const unzoomTitle = this.context.translate('panzoom.unzoom', 'Zoom out');
    let slider = null;
    if (this.props.showZoomSlider) {
      slider = (
        <DivSlider
          ref={(containerThumb) => {
            this.containerThumb = containerThumb;
          }}
          className={`${this.props.className}-zoom-slider`}
        >
          <ButtonSliderThumb
            ref={(btnThumb) => {
              this.btnThumb = btnThumb;
            }}
            className={`${this.props.className}-zoom-slider-thumb`}
          />
        </DivSlider>
      );
    }
    let top = 50;
    if (this.props.showPan) {
      top += 140;
    }
    return (
      <div className="ol-unselectable ol-control" style={{ top: `${top}px`, left: `15px` }}>
        <ButtonZoom className={`${this.props.className}-zoom`} onClick={this.handleZoomButtonClick} title={zoomTitle} />
        {slider}
        <ButtonUnzoom
          className={`${this.props.className}-unzoom`}
          onClick={this.handleUnzoomButtonClick}
          title={unzoomTitle}
        />
      </div>
    );
  }

  public renderRotation(): React.ReactNode {
    if (!this.props.showRotation) {
      return null;
    }
    const rotateTitle = this.context.translate('panzoom.rotate', 'Set map orientation to north up');
    return (
      <div className="ol-unselectable ol-control">
        <ButtonRotate
          ref={(buttonRotate) => {
            this.buttonRotate = buttonRotate;
          }}
          className={`${this.props.className}-rotate`}
          onClick={this.handleResetRotationButtonClick}
          title={rotateTitle}
        >
          <div
            ref={(divRotate) => {
              this.divRotate = divRotate;
            }}
          >
            <SpanRotate className={`${this.props.className}-span-rotate`} />
          </div>
        </ButtonRotate>
      </div>
    );
  }

  public renderTool(): React.ReactNode {
    if (this.props.disabled === true) {
      return null;
    }
    return (
      <Container className={this.props.className}>
        {this.renderPan()}
        {this.renderZoom()}
        {this.renderRotation()}
      </Container>
    );
  }
}
