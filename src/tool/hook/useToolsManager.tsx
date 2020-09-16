import * as React from 'react';
import { rolContext } from '../../RolContext';
import { ToolsManager } from '../../ToolsManager';

export function useToolsManager(props: {} = {}): ToolsManager {
  const context = React.useContext(rolContext);
  return context.toolsManager;
}
