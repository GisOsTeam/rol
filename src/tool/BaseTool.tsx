import * as React from 'react';
import { IRolContext, rolContext } from '../RolContext';

export interface IBaseToolProps {
  /**
   * Unique id is mandatory.
   */
  uid: string;
  /**
   * Activated.
   */
  activated?: boolean;
  /**
   * Activated by default when all others are deactivated.
   */
  defaultActivated?: boolean;
  /**
   * Independant.
   */
  independant?: boolean;
  /**
   * Disabled.
   */
  disabled?: boolean;
  /**
   * Class name.
   */
  className?: string;
}

export class BaseTool<P extends IBaseToolProps, S> extends React.Component<P, S> {
  public static defaultProps = {
    activated: false,
    defaultActivated: false,
    independant: false,
    className: 'tool',
  };

  public static contextType: React.Context<IRolContext> = rolContext;

  public context: IRolContext;

  public componentDidMount() {
    this.toolDidConstruct();
    if (this.props.activated == true) {
      this.toolDidActivate();
    } else {
      this.toolDidDeactivate();
    }
  }

  public componentDidUpdate(prevProps: P, prevState: S, snap: any) {
    if (this.props.activated == true && prevProps.activated != true) {
      this.toolDidActivate();
    }
    if (this.props.activated != true && prevProps.activated == true) {
      this.toolDidDeactivate();
    }
  }

  public componentWillUnmount() {
    this.toolDidDestroy();
  }

  public toolDidConstruct(): void {}

  public toolDidActivate(): void {}

  public toolDidDeactivate(): void {}

  public toolDidDestroy(): void {}

  /**
   * Activate tool.
   */
  public activate(force: boolean = false) {
    this.context.toolsManager.activateTool(this.props.uid, force);
  }

  /**
   * Deactivate tool
   */
  public deactivate() {
    this.context.toolsManager.deactivateTool(this.props.uid);
  }

  public handleBaseToolClick = () => {
    this.activate();
  };

  public renderTool(): React.ReactNode {
    return null;
  }

  public render(): React.ReactNode {
    const className = `${this.props.className}
      ${this.props.activated ? `${this.props.className}-activated` : `${this.props.className}-unactivated`}
      ${this.props.disabled ? `${this.props.className}-disabled` : `${this.props.className}-enabled`}`;
    return (
      <div onClick={this.handleBaseToolClick} className={className}>
        {this.renderTool()}
      </div>
    );
  }
}

export function withBaseTool<P extends IBaseToolProps>(
  component: string | React.FunctionComponent<IBaseToolProps> | React.ComponentClass<IBaseToolProps, {}>,
  defaultProps?: Partial<IBaseToolProps>
) {
  const tool = class extends BaseTool<P, {}> {
    public renderTool(): React.ReactNode {
      return React.createElement(component, this.props);
    }
  };
  tool.defaultProps = { ...tool.defaultProps, ...defaultProps };
  return tool;
}
