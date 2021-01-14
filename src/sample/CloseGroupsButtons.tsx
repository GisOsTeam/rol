import * as React from 'react';
import styled from 'styled-components';
import { IOneShotButtonTool, withOneShotButtonTool } from '../tool';
import { useGroupesManager } from '../tool/hook/useGroupsManager';

const ContainerBtn = styled.div``;

export const CloseGroupsButton = withOneShotButtonTool(
  (props: IOneShotButtonTool) => {
    const groupsManager = useGroupesManager();
    React.useEffect(() => {
      if (props.activated === true) {
        groupsManager.foldGroup("GroupButton");
      }
    }, [props.activated]);
    return <ContainerBtn>Fold Groups</ContainerBtn>;
  },
  { className: 'counter-button' }
);
