import * as React from 'react';
import { BaseTool, IBaseToolProps } from './tool/BaseTool';
import { jsonEqual } from '@gisosteam/aol/utils';
import { BaseContainer } from './container/BaseContainer';

export type absElementStatus = null | 'react' | 'ext' | 'del';

export interface IAbstractElement {
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
  status: Readonly<absElementStatus>;
}

const toolMaps = new Map<string, Map<string, IAbstractElement>>();

export abstract class ToolsManager<T extends React.Component<Tprops>, Tprops extends Pick<IBaseToolProps, "uid">> {
  private uid: string;

  private refresh: () => void;

  constructor(uid: string, refresh: () => void) {
    this.uid = uid;
    this.refresh = refresh;
    toolMaps.set(uid, new Map<string, IAbstractElement>());
  }

  /**
   * Get toolElements
   */
  public getElements(
    filterFn?: (value: IAbstractElement, index: number, array: IAbstractElement[]) => boolean,
    thisFilterArg?: any
  ): IAbstractElement[] {
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
  public updateElementProps(uid: string, props: any, refreshIfChanging = true) {
    const toolElement = this.getElements((subToolElement) => subToolElement.uid === uid).pop();
    if (toolElement != null) {
      this.setElement(
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
        refreshIfChanging
      );
    } else {
      console.error(`Element not found for uid ${uid}`);
    }
  }

  /**
   * Create and add tool props
   */
  public createAndAddElement(
    cl: React.ClassType<Tprops, T, any>,
    props: Tprops
  ) {
    const reactElement = React.createElement(cl, {
      ...props,
      uid: props.uid,
    });
    this.setElement({
      reactElement,
      uid: props.uid,
      updatedProps: {},
      status: 'ext',
    });
  }

  /**
   * Update from children
   */
  public fromChildren(nextChildren: React.ReactNode) {
    const toDel = new Set<string>();
    // Old children
    this.getElements((toolElement) => toolElement.status === 'react').map((toolElement) => {
      toDel.add(toolElement.uid);
    });
    // Next children
    this.fromSubChildren(nextChildren, toDel);
    // Set status to 'del' removed children
    toDel.forEach((uid: string) => {
      const toolElement = this.getElements((subToolElement) => subToolElement.uid === uid).pop();
      if (toolElement != null) {
        toolElement.status = 'del';
      }
    });
  }

  /**
   * Set toolElement
   */
  private setElement(element: IAbstractElement, refreshIfChanging = true) {
    const toolMap = toolMaps.get(this.uid);
    if (toolMap == null) {
      return false;
    }
    const found = toolMap.get(element.uid);
    let changed = false;
    if (!found) {
      if (element.status !== 'del') {
        toolMap.set(element.uid, {
          ...element,
        });
        changed = true;
      }
    } else {
      if (element.status === 'del') {
        if (found.status === 'react') {
          toolMap.set(element.uid, {
            ...element,
            status: 'del',
          });
          changed = true;
        } else if (found.status === 'ext') {
          toolMap.delete(element.uid);
          changed = true;
        }
      } else {
        toolMap.set(element.uid, {
          ...element,
        });
        changed = !jsonEqual(found.reactElement.props, element.reactElement.props, ['children']);
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
              this.setElement({
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
