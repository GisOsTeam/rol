import * as React from 'react';
import { BaseTool, IBaseToolProps } from './tool/BaseTool';
import { jsonEqual } from '@gisosteam/aol/utils';
import { BaseContainer } from './container/BaseContainer';

export type toolElementStatus = null | 'react' | 'ext' | 'del';

export interface IToolElement {
  /**
   * React Element.
   */
  reactElement: Readonly<React.ReactElement>;
  /**
   * Unique id.
   */
  uid: Readonly<string>;
  /**
   * Updated props.
   */
  updatedProps: any;
  /**
   * Status.
   */
  status: Readonly<toolElementStatus>;
}

const toolMaps = new Map<string, Map<string, IToolElement>>();

export class ToolsManager {
  private uid: string;

  private refresh: () => void;

  constructor(uid: string, refresh: () => void) {
    this.uid = uid;
    this.refresh = refresh;
    toolMaps.set(uid, new Map<string, IToolElement>());
  }

  /**
   * Get toolElements
   */
  public getToolElements(
    filterFn?: (value: IToolElement, index: number, array: IToolElement[]) => boolean,
    thisFilterArg?: any,
  ): IToolElement[] {
    const toolMap = toolMaps.get(this.uid);
    if (toolMap == null) {
      return [];
    }
    const arr = Array.from(toolMap.values()).filter((toolElement) => toolElement.status !== 'del');
    return filterFn == null ? arr : arr.filter(filterFn, thisFilterArg);
  }

  /**
   * Update tool props
   */
  public updateToolProps(uid: string, props: any, refreshIfChanging = true) {
    const toolElement = this.getToolElements((subToolElement) => subToolElement.uid === uid).pop();
    if (toolElement != null) {
      this.setToolElement(
        {
          ...toolElement,
          reactElement: React.cloneElement(toolElement.reactElement, {
            ...toolElement.reactElement.props,
            ...props,
            uid,
            key: uid,
          }),
          updatedProps: { ...toolElement.updatedProps, ...props },
        },
        refreshIfChanging,
      );
    } else {
      console.error(`Element not found for uid ${uid}`);
    }
  }

  /**
   * Create and add tool props
   */
  public createAndAddTool(
    cl: React.ClassType<IBaseToolProps, BaseTool<IBaseToolProps, any>, any>,
    props: IBaseToolProps,
  ) {
    const reactElement = React.createElement(cl, {
      ...props,
      uid: props.uid,
    });
    this.setToolElement({
      reactElement,
      uid: props.uid,
      updatedProps: {},
      status: 'ext',
    });
  }

  public activateTool(uid: string, force = false) {
    const toolElement = this.getToolElements((subToolElement) => subToolElement.uid === uid).pop();
    if (toolElement == null) {
      console.error(`Element not found for uid ${uid}`);
      return;
    }
    const props = toolElement.reactElement.props as IBaseToolProps;
    if (force) {
      this.updateToolProps(uid, { activated: false });
      setTimeout(() => {
        this.activateTool(uid);
      }, 1);
      return;
    }
    if (!props.activated || force) {
      if (!props.independant) {
        this.getToolElements((otherToolElement) => otherToolElement.uid !== uid).forEach((otherToolElement) => {
          if (!(otherToolElement.reactElement.props as IBaseToolProps).independant) {
            this.updateToolProps(otherToolElement.uid, { activated: false });
          }
        });
      }
      this.updateToolProps(uid, { activated: true });
    }
  }

  public deactivateTool(uid: string) {
    const toolElement = this.getToolElements((subToolElement) => subToolElement.uid === uid).pop();
    if (toolElement == null) {
      console.error(`Element not found for uid ${uid}`);
      return;
    }
    const props = toolElement.reactElement.props as IBaseToolProps;
    if (props.activated) {
      this.updateToolProps(uid, { activated: false });
      if (!props.independant) {
        let defaultTool: IToolElement;
        this.getToolElements((otherToolElement) => otherToolElement.uid !== uid).forEach((otherToolElement) => {
          if (!(otherToolElement.reactElement.props as IBaseToolProps).independant) {
            this.updateToolProps(otherToolElement.uid, { activated: false });
            if ((otherToolElement.reactElement.props as IBaseToolProps).defaultActivated) {
              defaultTool = otherToolElement;
            }
          }
        });
        if (defaultTool != null) {
          this.activateTool(defaultTool.uid);
        }
      }
    }
  }

  /**
   * Update from children
   */
  public fromChildren(nextChildren: React.ReactNode) {
    const toDel = new Set<string>();
    // Old children
    this.getToolElements((toolElement) => toolElement.status === 'react').map((toolElement) => {
      toDel.add(toolElement.uid);
    });
    // Next children
    this.fromSubChildren(nextChildren, toDel);
    // Set status to 'del' removed children
    toDel.forEach((uid: string) => {
      const toolElement = this.getToolElements((subToolElement) => subToolElement.uid === uid).pop();
      if (toolElement != null) {
        toolElement.status = 'del';
      }
    });
  }

  /**
   * Set toolElement
   */
  private setToolElement(toolElement: IToolElement, refreshIfChanging = true) {
    const toolMap = toolMaps.get(this.uid);
    if (toolMap == null) {
      return false;
    }
    const found = toolMap.get(toolElement.uid);
    let changed = false;
    if (!found) {
      if (toolElement.status !== 'del') {
        toolMap.set(toolElement.uid, {
          ...toolElement,
        });
        changed = true;
      }
    } else {
      if (toolElement.status === 'del') {
        if (found.status === 'react') {
          toolMap.set(toolElement.uid, {
            ...toolElement,
            status: 'del',
          });
          changed = true;
        } else if (found.status === 'ext') {
          toolMap.delete(toolElement.uid);
          changed = true;
        }
      } else {
        toolMap.set(toolElement.uid, {
          ...toolElement,
        });
        changed = !jsonEqual(found.reactElement.props, toolElement.reactElement.props, ['children']);
      }
    }
    if (refreshIfChanging && changed) {
      this.refresh();
    }
  }

  private fromSubChildren(children: React.ReactNode, toDel: Set<string>) {
    const toolMap = toolMaps.get(this.uid);
    if (toolMap == null) {
      return;
    }
    // Next children
    if (children) {
      React.Children.forEach(children, (nextChild: React.ReactElement<any>) => {
        if (nextChild != null && BaseTool.isPrototypeOf(nextChild.type)) {
          const uid = nextChild.props.uid;
          // uid is null: log error
          if (uid == null) {
            console.error('Unique id is mandatory');
          } else {
            const toolElement = toolMap.get(uid);
            if (toolElement == null || toolElement.status === 'react') {
              if (toDel.has(uid)) {
                toDel.delete(uid);
              }
              const props = { ...nextChild.props, ...(toolElement != null ? toolElement.updatedProps : {}), key: uid };
              this.setToolElement({
                reactElement: React.cloneElement(nextChild, props),
                status: 'react',
                updatedProps: toolElement != null ? toolElement.updatedProps : {},
                uid,
              });
            }
          }
        }
        if (nextChild != null && BaseContainer.isPrototypeOf(nextChild.type)) {
          this.fromSubChildren(nextChild.props.children, toDel);
        }
      });
    }
  }
}
