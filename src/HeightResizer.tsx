import * as React from 'react';
import { rolContext, IRolContext } from './RolContext';

export interface IResizerProps {
  /**
   * Height percent.
   */
  heightPercent?: number;
  /**
   * Height removal.
   */
  heightRemoval?: string;
}

export class HeightResizer extends React.Component<IResizerProps, never> {
  public static contextType: React.Context<IRolContext> = rolContext;

  public static defaultProps = {
    heightPercent: 100,
    heightRemoval: '0px',
  };

  public context: IRolContext;

  public componentDidMount() {
    window.addEventListener('resize', this.updateSize);
    setTimeout(() => {
      this.updateSize();
    }, 1000);
  }

  public componentDidUpdate(prevProps: IResizerProps, prevState: never, snap: never) {
    this.updateSize();
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
  }

  public updateSize = () => {
    const olMap = this.context.olMap;
    const targetElement = olMap.getTargetElement() as HTMLElement;
    if (targetElement) {
      targetElement.parentElement.style.height = `calc(${this.props.heightPercent}% - ${this.props.heightRemoval})`;
      const w = targetElement.offsetWidth;
      const h = targetElement.parentElement.offsetHeight;
      targetElement.style.height = `${h}px`;
      olMap.setSize([w, h]);
    }
  };

  public render(): React.ReactNode {
    return null;
  }
}
