import { IdentifyButton } from './identify/IdentifyButton';
import { IdentifyContent } from './identify/IdentifyContent';
import { IdentifyHeader } from './identify/IdentifyHeader';
import { withBaseWindowTool } from './BaseWindowTool';

export const Identify = withBaseWindowTool(IdentifyContent, IdentifyHeader, IdentifyButton, { className: 'identify' });
