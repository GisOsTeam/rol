import * as React from 'react';
import { GroupsManager } from '../../GroupManager';
import { rolContext } from '../../RolContext';

export function useGroupesManager(): GroupsManager {
  const context = React.useContext(rolContext);
  return context.groupsManager;
}
