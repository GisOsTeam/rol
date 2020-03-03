import { ReprojButton } from './reproj/ReprojButton';
import { ReprojContent } from './reproj/ReprojContent';
import { ReprojHeader } from './reproj/ReprojHeader';
import { withBaseWindowTool } from './BaseWindowTool';

export const Reproj = withBaseWindowTool(ReprojContent, ReprojHeader, ReprojButton, { className: 'reproj' });
