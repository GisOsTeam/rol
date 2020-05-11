import { IdentifyButton } from './identify/IdentifyButton';
import { IdentifyContent, IIdentifyContentProps } from './identify/IdentifyContent';
import { IdentifyHeader } from './identify/IdentifyHeader';
import { withBaseWindowTool, IBaseWindowToolProps } from './BaseWindowTool';

export type IIdentifyProps = IBaseWindowToolProps & Partial<IIdentifyContentProps>;

export const Identify = withBaseWindowTool<IIdentifyProps>(IdentifyContent, IdentifyHeader, IdentifyButton, {
  className: 'identify',
});
