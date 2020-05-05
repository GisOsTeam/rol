import * as React from 'react';
import styled, { ThemedStyledFunction } from 'styled-components';
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

const TitleBar = styled.div<Pick<{ activated?: boolean }, 'activated'>>`
  height: 20px;
  background: ${(props) => (props.activated ? '#88f' : '#ddd')};
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
    hideCloseButton: false,
  };

  public windowElement: HTMLSpanElement;

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
          bottom: Window.innerHeight - boundingRect.top - boundingRect.height,
          left: -boundingRect.left,
          right: Window.innerWidth - boundingRect.right,
        },
      });
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
      position: null,
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
          handle={`.${this.props.className.split(/\s+/g)[0]}-titlebar`}
          onStart={this.start.bind(this)}
          bounds={this.state.bounds}
          defaultPosition={{ x: 0, y: 0 }}
          position={this.state.position}
        >
          <Window
            className={className}
            onClick={this.handleWindowClick}
            style={style}
            ref={(ref) => (this.windowElement = ref)}
          >
            <TitleBar className={titleClassName} activated={this.props.activated}>
              {this.renderHeaderContent()}
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
