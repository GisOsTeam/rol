import * as React from 'react';
import { ProjectionInfo, addProjection } from '@gisosteam/aol/ProjectionInfo';
import { Extent } from 'ol/extent';

export interface IProjectionProps {
  code: string;
  wkt?: string;
  lonLatValidity?: Extent;
  name?: string;
  remarks?: string;
}

export class Projection extends React.Component<IProjectionProps, any> {
  public projectionInfo: ProjectionInfo;

  constructor(props: IProjectionProps) {
    super(props);
    this.projectionInfo = addProjection(props.code, props.wkt, props.lonLatValidity, props.name, props.remarks);
  }

  public render(): React.ReactNode {
    return <div id={`projection_${this.projectionInfo.code}`} key={`projection_${this.projectionInfo.code}`}></div>;
  }
}
