import * as React from 'react';
import styled from 'styled-components';
import OlView from 'ol/View';
import { transformExtent } from 'ol/proj';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';
import { ProjectionInfo, getProjectionInfos, getProjectionInfo } from '@gisosteam/aol/ProjectionInfo';
import { rolContext } from '../../RolContext';

const Container = styled.div`
  margin: 2px;
`;

export function ReprojContent(props: IFunctionBaseWindowToolProps) {
  const { olMap } = React.useContext(rolContext);
  const view = olMap.getView();
  const [projCode, setProjCode] = React.useState<string>(view.getProjection().getCode());
  return (
    <Container className={`${props.className}`}>
      <select
        className="form-control"
        value={projCode}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setProjCode(e.currentTarget.value);
          const projInfo = getProjectionInfo(e.currentTarget.value);
          const newView = new OlView({
            projection: projInfo.code,
            zoom: 1,
            center: [0, 0]
          });
          olMap.setView(newView);
          if (projInfo.lonLatValidity != null) {
            const extent = transformExtent(projInfo.lonLatValidity, 'EPSG:4326', projInfo.code);
            newView.fit(extent);
          }
        }}
      >
        {getProjectionInfos().map((projectionInfo: ProjectionInfo) => {
          return (
            <option key={projectionInfo.code} value={projectionInfo.code}>
              {`${projectionInfo.code} - ${projectionInfo.name}`}
            </option>
          );
        })}
      </select>
    </Container>
  );
}
