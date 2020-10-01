import { ShowsnapshotButton } from './showsnapshot/ShowsnapshotButton';
import { ShowsnapshotContent, IShowsnapshotContentProps } from './showsnapshot/ShowsnapshotContent';
import { ShowsnapshotHeader } from './showsnapshot/ShowsnapshotHeader';
import { withBaseWindowTool, IBaseWindowToolProps } from './BaseWindowTool';

export type IShowsnapshotProps = IBaseWindowToolProps & Partial<IShowsnapshotContentProps>;

export const ShowSnapshot = withBaseWindowTool<IShowsnapshotProps>(ShowsnapshotContent, ShowsnapshotHeader, ShowsnapshotButton, {
  className: 'showsnapshot',
});
