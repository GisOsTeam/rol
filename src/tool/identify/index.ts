import { IdentifyButton } from './IdentifyButton';
import { IdentifyContent } from './IdentifyContent';
import { IdentifyHeader } from './IdentifyHeader';
import { withBaseWindowTool } from '../BaseWindowTool';

export const Identify = withBaseWindowTool(IdentifyContent, IdentifyHeader, IdentifyButton, { className: 'identify' });