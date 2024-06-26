import * as React from 'react';
import { IRolContext, rolContext } from '../RolContext';
import { RolCssClassNameEnum } from '../RolCssClassNameEnum';

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

  public componentDidUpdate(prevProps: P, prevState: S, snap: never) {
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

  public toolDidConstruct(): void {
    // do nothing.
  }

  public toolDidActivate(): void {
    // do nothing.
  }

  public toolDidDeactivate(): void {
    // do nothing.
  }

  public toolDidDestroy(): void {
    // do nothing.
  }

  /**
   * Activate tool.
   */
  public activate(force = false) {
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
    const rolActivated = this.props.activated ? RolCssClassNameEnum.ACTIVATED : RolCssClassNameEnum.DEACTIVATED;
    const rolEnabled = this.props.disabled ? RolCssClassNameEnum.DISABLED : RolCssClassNameEnum.ENABLED;
    const rolClasses = `${rolActivated} ${rolEnabled}`;
    const className = `${rolClasses} ${this.props.className}
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
  component: string | React.FunctionComponent<P> | React.ComponentClass<P, never>,
  defaultProps?: Partial<P>,
) {
  const Tool = class extends BaseTool<P, never> {
    public renderTool(): React.ReactNode {
      return React.createElement(component, this.props);
    }
  };
  Tool.defaultProps = { ...Tool.defaultProps, ...defaultProps };
  return Tool;
}
