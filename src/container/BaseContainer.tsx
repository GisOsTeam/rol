import * as React from 'react';
import { IRolContext, rolContext } from '../RolContext';
import { BaseTool } from '../tool/BaseTool';

export interface IBaseContainerProps {
  /**
   * Content.
   */
  children: React.ReactNode;
}

export interface IBaseContaineState {
  /**
   * Changed counter.
   */
  changedCounter: number;
}

export class BaseContainer<P extends IBaseContainerProps, S extends IBaseContaineState> extends React.Component<P, S> {
  public static contextType: React.Context<IRolContext> = rolContext;

  public context: IRolContext;

  public constructor(props: P) {
    super(props);
  }

  public refresh = () => {
    this.setState((prevState: IBaseContaineState) => {
      return { changedCounter: prevState.changedCounter + 1 };
    });
  };

  public renderChildren(): React.ReactElement<any>[] {
    const elems: React.ReactElement<any>[] = [];
    // Tools
    React.Children.map(this.props.children, (child: React.ReactElement<any>) => {
      if (child != null && BaseTool.isPrototypeOf(child.type)) {
        if (child != null && BaseTool.isPrototypeOf(child.type)) {
          const toolElement = this.context.toolsManager
            .getToolElements((toolElement) => toolElement.uid == child.props.uid)
            .pop();
          if (toolElement != null) {
            elems.push(toolElement.reactElement);
          }
        }
      }
    });
    // Containers
    React.Children.map(this.props.children, (child: React.ReactElement<any>) => {
      if (child != null && BaseContainer.isPrototypeOf(child.type)) {
        elems.push(child);
      }
    });
    return elems;
  }

  public render(): React.ReactNode {
    return this.renderChildren();
  }
}
