import * as React from 'react';
import { BaseContainer, IBaseContainerProps, IBaseContaineState } from './BaseContainer';

export interface IZoneProps extends IBaseContainerProps {
  /**
   * Content.
   */
  children: React.ReactNode;
  /**
   * Class name.
   */
  className?: string;
  /**
   * Style.
   */
  style?: React.CSSProperties;
}

export interface IZoneState extends IBaseContaineState {}

export class Zone extends BaseContainer<IZoneProps, IZoneState> {
  public static defaultProps = {
    className: 'zone'
  };

  constructor(props: IZoneProps) {
    super(props);
  }

  public render(): React.ReactNode {
    const className = `${this.props.className}`;
    return (
      <div className={className} style={this.props.style}>
        {this.renderChildren()}
      </div>
    );
  }
}
