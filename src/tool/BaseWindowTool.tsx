import * as React from 'react';
import styled, { ThemedStyledFunction } from 'styled-components';
import * as Draggable from 'react-draggable';
import { BaseButtonTool, IBaseButtonToolProps } from './BaseButtonTool';

const Window = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  border: 1px solid #cccccc;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 3px;
`;

const Button = styled.button<{ activated?: boolean; independant?: boolean }>`
  height: 32px;
  min-width: 32px;
  background-color: ${(props) =>
    props.activated && !props.independant ? 'rgba(245,245,245,0.61)' : 'rgba(213,213,213,0.61)'};
  border-style: solid;
  border-color: ${(props) =>
    props.activated && !props.independant ? 'rgba(145,145,145,0.61)' : 'rgba(172,172,172,0.61)'};
  color: #242424;
  box-shadow: none;
  display: inline-flex;
  border-width: 1px !important;
  border-radius: 5px !important;
  padding-top: 4px;
`;

const TitleBar = styled.div<Pick<{ activated?: boolean }, 'activated'>>`
  height: 20px;
  background: ${(props) => (props.activated ? '#88f' : '#ddd')};
  border: 1px solid #999;
  border-radius: 2px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 3px 5px;
  text-align: center;
  cursor: move;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const TitleBarContent = styled.span`
  flex-grow: 1;
`;

const TitleBarCloseButton = styled.button<{ activated?: boolean; independant?: boolean }>`
  flex-grow: 0;
  height: 18px;
  width: 18px;
  border-style: none;
  margin: 0;
  padding: 0;
  background: ${(props) => (props.activated ? '#88f' : '#ddd')};
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
   * Window header content.
   */
  WindowHeader?: React.ReactNode;
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
   * Open on activate
   */
  openOnActivate?: boolean;
  /**
   * Open handler.
   */
  onOpen?: () => void;
  /**
   * Close handler.
   */
  onClose?: () => void;
  /**
   * Default position.
   */
  defaultPosition?: { x: number; y: number };
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
  bounds: { top: number; bottom: number; left: number; right: number };
  /**
   * Position.
   */
  position: { x: number; y: number };
}

export class BaseWindowTool<
  P extends IBaseWindowToolProps = IBaseWindowToolProps,
  S extends IBaseWindowToolState = IBaseWindowToolState
> extends BaseButtonTool<P, S> {
  public static defaultProps = {
    ...BaseButtonTool.defaultProps,
    defaultOpened: false,
    hideCloseButton: false,
    defaultPosition: { x: 200, y: 200 },
  };

  public windowElement: HTMLSpanElement;

  constructor(props: P) {
    super(props);
    this.state = { open: false, position: this.props.defaultPosition } as Readonly<S>;
  }

  public componentDidMount() {
    super.componentDidMount();
    window.addEventListener('resize', this.handleResize);
    if (this.props.defaultOpened) {
      this.open();
    }
  }

  public componentDidUpdate(prevProps: P, prevState: S, snap: any) {
    super.componentDidUpdate(prevProps, prevState, snap);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  toolDidActivate() {
    if (this.props.openOnActivate) {
      this.open();
    }
  }

  /**
   * Open Window.
   */
  public open(): boolean {
    if (this.state.open) {
      return false;
    }
    this.setState(
      {
        open: true,
        zIndex: topZIndex++,
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
   * Close Window
   */
  public close(): boolean {
    if (!this.state.open) {
      return false;
    }
    this.setState(
      {
        open: false,
        position: this.props.defaultPosition,
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

  public checkPosition(position: { x: number; y: number }) {
    if (position == null) {
      return;
    }
    let { x, y } = position;
    const boundingRect = this.windowElement.getBoundingClientRect();
    const bounds = {
      top: 0,
      bottom: window.innerHeight - boundingRect.height,
      left: 0,
      right: window.innerWidth - boundingRect.width,
    };
    if (x > bounds.right) {
      x = bounds.right;
    }
    if (x < bounds.left) {
      x = bounds.left;
    }
    if (y > bounds.bottom) {
      y = bounds.bottom;
    }
    if (y < bounds.top) {
      y = bounds.top;
    }
    this.setState({ position: { x, y } });
  }

  public handleResize = () => {
    this.checkPosition(this.state.position);
  };

  public handleStart = () => {
    this.activate();
  };

  public handleDrag = (e: any, position: { x: number; y: number }) => {
    this.checkPosition(position);
  };

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
        zIndex: this.state.zIndex,
      };
    } else {
      style = {
        zIndex: 0,
        display: 'none',
      };
    }
    const className = `${this.props.className}
      ${this.state.open ? `${this.props.className}-open` : `${this.props.className}-closed`}
      ${this.props.activated ? `${this.props.className}-activated` : `${this.props.className}-unactivated`}
      ${this.props.disabled ? `${this.props.className}-disabled` : `${this.props.className}-enabled`}`;
    const openButtonClassName = `${this.props.className.split(/\s+/g)[0]}-open-button
      ${
        this.state.open
          ? `${this.props.className.split(/\s+/g)[0]}-open-button-open`
          : `${this.props.className.split(/\s+/g)[0]}-open-button-closed`
      }
      ${
        this.props.activated
          ? `${this.props.className.split(/\s+/g)[0]}-open-button-activated`
          : `${this.props.className.split(/\s+/g)[0]}-open-button-unactivated`
      }
      ${
        this.props.disabled
          ? `${this.props.className.split(/\s+/g)[0]}-open-button-disabled`
          : `${this.props.className.split(/\s+/g)[0]}-open-button-enabled`
      }`;
    const titleClassName = `${this.props.className.split(/\s+/g)[0]}-titlebar
      ${
        this.state.open
          ? `${this.props.className.split(/\s+/g)[0]}-titlebar-open`
          : `${this.props.className.split(/\s+/g)[0]}-titlebar-closed`
      }
      ${
        this.props.activated
          ? `${this.props.className.split(/\s+/g)[0]}-titlebar-activated`
          : `${this.props.className.split(/\s+/g)[0]}-titlebar-unactivated`
      }
      ${
        this.props.disabled
          ? `${this.props.className.split(/\s+/g)[0]}-titlebar-disabled`
          : `${this.props.className.split(/\s+/g)[0]}-titlebar-enabled`
      }`;
    const titleContentClassName = `${this.props.className.split(/\s+/g)[0]}-titlebar-content`;
    const contentClassName = `${this.props.className.split(/\s+/g)[0]}-content
      ${
        this.state.open
          ? `${this.props.className.split(/\s+/g)[0]}-content-open`
          : `${this.props.className.split(/\s+/g)[0]}-content-closed`
      }
      ${
        this.props.activated
          ? `${this.props.className.split(/\s+/g)[0]}-content-activated`
          : `${this.props.className.split(/\s+/g)[0]}-content-unactivated`
      }
      ${
        this.props.disabled
          ? `${this.props.className.split(/\s+/g)[0]}-content-disabled`
          : `${this.props.className.split(/\s+/g)[0]}-content-enabled`
      }`;
    const Drag: React.ComponentClass<any> = Draggable as any;
    let openButton = null;
    if (!this.props.hideOpenButton) {
      openButton = (
        <Button
          className={openButtonClassName}
          title={this.props.buttonTitle}
          onClick={this.handleButtonClick}
          activated={this.props.activated}
          independant={this.props.independant}
        >
          {this.renderOpenButtonContent()}
        </Button>
      );
    }
    let closeButton = null;
    if (!this.props.hideCloseButton) {
      closeButton = (
        <TitleBarCloseButton
          className={`${this.props.className.split(/\s+/g)[0]}-titlebar-close-button`}
          onClick={this.handleCloseClick}
          activated={this.props.activated}
          independant={this.props.independant}
        />
      );
    }
    return (
      <React.Fragment>
        {openButton}
        <Drag
          handle={`.${titleContentClassName}`}
          onStart={this.handleStart}
          onDrag={this.handleDrag}
          position={this.state.position}
        >
          <Window
            className={className}
            onClick={this.handleWindowClick}
            style={style}
            ref={(ref) => (this.windowElement = ref)}
          >
            <TitleBar className={titleClassName} activated={this.props.activated}>
              <TitleBarContent className={titleContentClassName}>{this.renderHeaderContent()}</TitleBarContent>
              {closeButton}
            </TitleBar>
            <Content className={contentClassName}>{this.renderTool()}</Content>
          </Window>
        </Drag>
      </React.Fragment>
    );
  }
}

export interface IFunctionBaseWindowToolProps extends IBaseWindowToolProps, IBaseWindowToolState {}

export function withBaseWindowTool<P extends IBaseWindowToolProps>(
  component:
    | string
    | React.FunctionComponent<IFunctionBaseWindowToolProps>
    | React.ComponentClass<IFunctionBaseWindowToolProps, {}>,
  headerContent:
    | string
    | React.FunctionComponent<IFunctionBaseWindowToolProps>
    | React.ComponentClass<IFunctionBaseWindowToolProps, {}>,
  openButtonContent:
    | string
    | React.FunctionComponent<IFunctionBaseWindowToolProps>
    | React.ComponentClass<IFunctionBaseWindowToolProps, {}>,
  defaultProps?: Partial<P>
) {
  const Tool = class extends BaseWindowTool<P, IBaseWindowToolState> {
    public renderHeaderContent(): React.ReactNode {
      return React.createElement(headerContent, { ...this.state, ...this.props, ...defaultProps });
    }
    public renderOpenButtonContent(): React.ReactNode {
      return React.createElement(openButtonContent, { ...this.state, ...this.props, ...defaultProps });
    }
    public renderTool(): React.ReactNode {
      return React.createElement(component, { ...this.state, ...this.props, ...defaultProps });
    }
  };
  Tool.defaultProps = { ...Tool.defaultProps, ...defaultProps };
  return Tool;
}
