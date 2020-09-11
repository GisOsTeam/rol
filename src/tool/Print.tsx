import { PrintButton } from './print/PrintButton';
import { PrintContent, IPrintContentProps } from './print/PrintContent';
import { PrintHeader } from './print/PrintHeader';
import { withBaseWindowTool, IBaseWindowToolProps } from './BaseWindowTool';

export type IPrintProps = IBaseWindowToolProps & Partial<IPrintContentProps>;

export const Print = withBaseWindowTool<IPrintProps>(PrintContent, PrintHeader, PrintButton, {
  className: 'print',
});
