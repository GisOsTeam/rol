import * as React from 'react';
import { BaseContainer } from './container/index';
import { GroupButtonTool } from './tool/index';

export type groupElementStatus = null | 'react' | 'ext' | 'del';

export interface IGroupElement {
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
  status: Readonly<groupElementStatus>;
}

const groupMaps = new Map<string, Map<string, IGroupElement>>();
export class GroupsManager {
  private uid: string;

  constructor(uid: string) {
    this.uid = uid;
    groupMaps.set(uid, new Map<string, IGroupElement>());
  }

  // registerGroup(group: GroupButtonTool) {
  //     groupMaps.get(this.uid).set(group.props.uid, group);
  // }

  getGroup(groupId: string) {
    return groupMaps.get(this.uid).get(groupId);
  }

  foldGroup(uid: string) {
    const group = this.getGroup(uid);
    if (group) {
      console.log(group);
      // GroupButtonTool.prototype.close.call(group)
      // group.close();
    }
  }

  unfoldGroup(uid: string) {
    const group = this.getGroup(uid);
    if (group) {
      // group.open();
    }
  }

  foldGroups(filter?: (group: GroupButtonTool) => boolean) {
    const groups = groupMaps.get(this.uid);
    console.log(groups, !filter);
    for (const group of Object.values(groups)) {
      if (!filter || filter(group)) group.close();
    }
  }

  fromChildren(children: React.ReactNode) {
    this.fromSubChildren(children);
  }

  /**
   * Set toolElement
   */
  private setGroupElement(groupElement: IGroupElement, refreshIfChanging = true) {
    const toolMap = groupMaps.get(this.uid);
    if (toolMap == null) {
      return false;
    }
    const found = toolMap.get(groupElement.uid);
    let changed = false;
    if (!found) {
      if (groupElement.status !== 'del') {
        toolMap.set(groupElement.uid, {
          ...groupElement,
        });
        changed = true;
      }
    } else {
      if (groupElement.status === 'del') {
        if (found.status === 'react') {
          toolMap.set(groupElement.uid, {
            ...groupElement,
            status: 'del',
          });
          changed = true;
        } else if (found.status === 'ext') {
          toolMap.delete(groupElement.uid);
          changed = true;
        }
      } else {
        toolMap.set(groupElement.uid, {
          ...groupElement,
        });
        changed = !jsonEqual(found.reactElement.props, groupElement.reactElement.props, ['children']);
      }
    }
    if (refreshIfChanging && changed) {
      this.refresh();
    }
  }

  private fromSubChildren(children: React.ReactNode) {
    // Next children
    if (children) {
      React.Children.forEach(children, (nextChild: React.ReactElement<any>) => {
        if (nextChild != null && BaseContainer.isPrototypeOf(nextChild.type) && nextChild.props.uid) {
          this.registerGroup(nextChild as any);
        }
        if (nextChild != null && BaseContainer.isPrototypeOf(nextChild.type)) {
          this.fromSubChildren(nextChild.props.children);
        }
      });
    }
  }
}
