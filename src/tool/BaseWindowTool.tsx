import * as React from 'react';
import styled from 'styled-components';
import * as Draggable from 'react-draggable';
import { BaseButtonTool, IBaseButtonToolProps } from './BaseButtonTool';

const Window = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid #cccccc;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 3px;
`;

const TitleBar = styled.div`
  height: 20px;
  background: #ddd;
  border: 1px solid #999;
  border-radius: 2px;
  display: block;
  margin-bottom: 10px;
  padding: 3px 5px;
  text-align: center;
  cursor: move;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const CloseButton = styled.span`
  position: absolute;
  right: 14px;
  cursor: pointer;
  &:after {
    content: '✖';
  }
`;

const Content = styled.div`
  margin: 2px;
`;

let topZIndex = 5000;

export interface IBaseWindowToolProps extends IBaseButtonToolProps {
  /**
   * Dialog header content.
   */
  dialogHeader?: React.ReactNode;
  /**
   * Default opened.
   */
  defaultOpened?: boolean;
  /**
   * Hide open button.
   */
  hideOpenButton?: boolean;
  /**
   * Hide close button.
   */
  hideCloseButton?: boolean;
  /**
   * Hide reduce button.
   */
  hideReduceButton?: boolean;
  /**
   * Open handler.
   */
  onOpen?: () => void;
  /**
   * Close handler.
   */
  onClose?: () => void;
}

export interface IBaseWindowToolState {
  /**
   * Open.
   */
  open: boolean;
  /**
   * ZIndex.
   */
  zIndex: number;
  /**
   * Bounds.
   */
  bounds: any;
  /**
   * Position.
   */
  position: any;
}

export class BaseWindowTool<
  P extends IBaseWindowToolProps = IBaseWindowToolProps,
  S extends IBaseWindowToolState = IBaseWindowToolState
> extends BaseButtonTool<P, S> {
  public static defaultProps = {
    ...BaseButtonTool.defaultProps,
    defaultOpened: false,
    hideCloseButton: false
  };

  private windowElement: HTMLSpanElement;

  constructor(props: P) {
    super(props);
    this.state = {} as Readonly<S>;
  }

  public componentDidMount() {
    super.componentDidMount();
    if (this.props.defaultOpened) {
      this.open();
    }
  }

  public componentDidUpdate(prevProps: P, prevState: S, snap: any) {
    super.componentDidUpdate(prevProps, prevState, snap);
    const boundingRect: any = this.windowElement ? this.windowElement.getBoundingClientRect() : {};
    if (boundingRect.height !== 0 && boundingRect.width !== 0 && !this.state.bounds) {
      this.setState({
        bounds: {
          top: -boundingRect.top,
          bottom: window.innerHeight - boundingRect.top - boundingRect.height,
          left: -boundingRect.left,
          right: window.innerWidth - boundingRect.right
        }
      });
    }
  }

  /**
   * Open window.
   */
  public open(): boolean {
    if (this.state.open) {
      return false;
    }
    this.setState(
      {
        open: true,
        zIndex: topZIndex++
      },
      () => {
        if (this.props.onOpen) {
          this.props.onOpen();
        }
        this.activate();
      }
    );
    return true;
  }

  /**
   * Close window
   */
  public close(): boolean {
    if (!this.state.open) {
      return false;
    }
    this.setState(
      {
        open: false
      },
      () => {
        if (this.props.onClose) {
          this.props.onClose();
        }
        this.deactivate();
      }
    );
    return true;
  }

  public start() {
    this.activate();
    this.setState({
      position: null
    });
  }

  public handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!this.props.disabled) {
      if (this.props.onButtonClick) {
        this.props.onButtonClick();
      }
      this.open();
      this.activate();
    }
  };

  public handleWindowClick = (event: React.MouseEvent<HTMLDivElement>) => {
    this.setState({ zIndex: topZIndex++ });
    this.activate();
  };

  public handleCloseClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.close();
  };

  public renderHeaderContent(): React.ReactNode {
    return null;
  }

  public renderOpenButtonContent(): React.ReactNode {
    return null;
  }

  public render(): React.ReactNode {
    let style;
    if (this.state.open) {
      style = {
        zIndex: this.state.zIndex
      };
    } else {
      style = {
        zIndex: 0,
        display: 'none'
      };
    }
    const className = `${this.props.className}
      ${this.state.open ? `${this.props.className}-open` : `${this.props.className}-closed`}
      ${this.props.activated ? `${this.props.className}-activated` : `${this.props.className}-unactivated`}
      ${this.props.disabled ? `${this.props.className}-disabled` : `${this.props.className}-activated`}`;
    const Drag: React.ComponentClass<any> = Draggable as any;
    let openButton = null;
    if (!this.props.hideOpenButton) {
      openButton = (
        <button
          className={`${this.props.className.split(/\s+/g)[0]}-open-button`}
          title={this.props.buttonTitle}
          onClick={this.handleButtonClick}
        >
          {this.renderOpenButtonContent()}
        </button>
      );
    }
    let closeButton = null;
    if (!this.props.hideCloseButton) {
      closeButton = (
        <CloseButton
          className={`${this.props.className.split(/\s+/g)[0]}-titlebar-close-button`}
          onClick={this.handleCloseClick}
        />
      );
    }
    return (
      <React.Fragment>
        {openButton}
        <Drag
          handle={`.${this.props.className}-titlebar`}
          onStart={this.start.bind(this)}
          bounds={this.state.bounds}
          defaultPosition={{ x: 0, y: 0 }}
          position={this.state.position}
        >
          <Window
            className={className}
            onClick={this.handleWindowClick}
            style={style}
            ref={ref => (this.windowElement = ref)}
          >
            <TitleBar className={`${this.props.className}-titlebar`}>
              {this.renderHeaderContent()}
              {closeButton}
            </TitleBar>
            <Content className={`${this.props.className}-content`}>{this.renderTool()}</Content>
          </Window>
        </Drag>
      </React.Fragment>
    );
  }
}
