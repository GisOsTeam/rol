import * as React from 'react';
import { BaseButtonTool } from './BaseButtonTool';
import styled from 'styled-components';
import { BaseContainer, IBaseContaineState, IZoneProps } from '../container';

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

const Group = styled.div<{ shouldDisplay: boolean; position: GroupPosition; offset: number }>`
  position: absolute;
  ${(props) => props.position}: -35px;
  ${(props) => (props.position === 'top' || props.position === 'bottom' ? 'left' : 'top')}: ${(props) =>
    props.offset}px;
  display: ${(props) => (props.shouldDisplay ? 'inherit' : 'none')};
`;

export type GroupPosition = 'top' | 'left' | 'right' | 'bottom';

export interface IGroupButtonToolProps extends IZoneProps {
  /**
   * Default position.
   */
  groupPosition?: GroupPosition;

  /**
   * Disabled
   */
  disabled?: boolean;

  /**
   * buttonTitle
   */
  buttonTitle?: string;

  /**
   * Button Text
   */
  btnContent?: JSX.Element;

  /**
   * btnClassName
   */
  btnClassName?: string;

  onFold?: (buttonGroup: GroupButtonTool) => void;

  onUnFold?: (buttonGroup: GroupButtonTool) => void;
}

export interface IGroupButtonToolState extends IBaseContaineState {
  /**
   * Open.
   */
  open: boolean;
}

export class GroupButtonTool<
  P extends IGroupButtonToolProps = IGroupButtonToolProps,
  S extends IGroupButtonToolState = IGroupButtonToolState
> extends BaseContainer<P, S> {
  private groupBtnRef: React.RefObject<HTMLButtonElement>;
  public static defaultProps: Partial<IGroupButtonToolProps> = {
    ...BaseButtonTool.defaultProps,
    groupPosition: 'top',
    children: [],
  };

  constructor(props: P) {
    super(props);
    this.state = { open: false } as Readonly<S>;
    this.groupBtnRef = React.createRef();
  }

  /**
   * Open Window.
   */
  public open(): boolean {
    if (this.state.open) {
      return false;
    }
    this.setState({ open: true }, () => {
      if (this.props.onUnFold) {
        this.props.onUnFold(this);
      }
    });
    return true;
  }

  /**
   * Close Window
   */
  public close(): boolean {
    if (!this.state.open) {
      return false;
    }
    this.setState({ open: false },
      () => {
        if (this.props.onFold) {
          this.props.onFold(this);
        }
      });
    return true;
  }

  public handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!this.props.disabled) {
      if (!this.state.open) {
        this.open();
      } else {
        this.close();
      }
    }
  };

  public handleCloseClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.close();
  };

  public render(): React.ReactNode {
    const className = `${this.props.className}
      ${this.state.open ? `open` : `closed`}
      ${this.props.disabled ? `disabled` : `enabled`}`;
    const openButtonClassName = `${this.props.btnClassName} ${this.props.className.split(/\s+/g)[0]}-open-button
      ${this.state.open ? `open` : `closed`}
      ${this.props.disabled ? `disabled` : `enabled`}`;

    let offset = 0;
    if (this.groupBtnRef.current) {
      const btn = this.groupBtnRef.current;
      const isTopOrBot = this.props.groupPosition === 'top' || this.props.groupPosition === 'bottom';
      offset = isTopOrBot ? btn.offsetLeft : btn.offsetTop;
    }

    return (
      <>
        <Button
          className={openButtonClassName}
          title={this.props.buttonTitle}
          onClick={this.handleButtonClick}
          activated={this.state.open}
          independant={true}
          ref={this.groupBtnRef}
        >
          {this.props.btnContent}
        </Button>
        <Group
          shouldDisplay={this.state.open}
          offset={offset}
          className={className}
          position={this.props.groupPosition}
        >
          {this.renderChildren()}
        </Group>
      </>
    );
  }
}
