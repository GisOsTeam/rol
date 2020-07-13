import * as React from 'react';
import { BaseButtonTool, IBaseButtonToolProps, withBaseButtonTool } from './BaseButtonTool';
import styled from 'styled-components';
import { IRolContext, rolContext } from '../RolContext';
import { BaseContainer, IBaseContainerProps, IBaseContaineState, Zone, IZoneState, IZoneProps } from '../container';
import { IBaseToolProps } from './BaseTool';

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

const Group = styled.div<{ shouldDisplay: boolean; position: GroupPosition }>`
  position: absolute;
  ${(props) => props.position}: -35px;
  display: ${(props) => (props.shouldDisplay ? 'inline' : 'none')};
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
  public static defaultProps: IGroupButtonToolProps = {
    ...BaseButtonTool.defaultProps,
    groupPosition: 'top',
    children: [],
  };

  constructor(props: P) {
    super(props);
    this.state = { open: false } as Readonly<S>;
  }

  /**
   * Open Window.
   */
  public open(): boolean {
    if (this.state.open) {
      return false;
    }
    this.setState({ open: true });
    return true;
  }

  /**
   * Close Window
   */
  public close(): boolean {
    if (!this.state.open) {
      return false;
    }
    this.setState({ open: false });
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

  public renderOpenButtonContent(): React.ReactNode {
    return `Grp Btn`;
  }

  public render(): React.ReactNode {
    const className = `${this.props.className}
      ${this.state.open ? `open` : `closed`}
      ${this.props.disabled ? `disabled` : `enabled`}`;
    const openButtonClassName = `${this.props.className.split(/\s+/g)[0]}-open-button
      ${this.state.open ? `open` : `closed`}
      ${this.props.disabled ? `disabled` : `enabled`}`;
    const openButton = (
      <Button
        className={openButtonClassName}
        title={this.props.buttonTitle}
        onClick={this.handleButtonClick}
        activated={this.state.open}
        independant={true}
      >
        {this.renderOpenButtonContent()}
      </Button>
    );

    const buttonGroup = (
      <Group shouldDisplay={this.state.open} className={className} position={this.props.groupPosition}>
        {this.renderChildren()}
      </Group>
    );

    return (
      <React.Fragment>
        {openButton}
        {buttonGroup}
      </React.Fragment>
    );
  }
}
