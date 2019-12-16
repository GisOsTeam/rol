import * as React from 'react';
import { rolContext } from '../../RolContext';
import { getDefaultLayerStyles } from '@gisosteam/aol/utils';
import { LocalVector, IExtended } from '@gisosteam/aol/source';
import { LayerStyles } from '@gisosteam/aol/LayerStyles';
import { SourceTypeEnum } from '@gisosteam/aol/source/types/sourceType';

export interface IUseDrawSourceProps {
  /**
   * Draw layer uid.
   */
  layerUid: string;
  /**
   * Persist.
   */
  persist: boolean;
  /**
   * Styles.
   */
  styles?: LayerStyles;
  /**
   * Name.
   */
  name?: string;
  /**
   * Snapshotable.
   */
  snapshotable?: boolean;
  /**
   * Listable.
   */
  listable?: boolean;
}

export function useDrawSource(props: IUseDrawSourceProps): LocalVector {
  const context = React.useContext(rolContext);
  const [uid, setUid] = React.useState<string>(null);
  const [source, setSource] = React.useState<LocalVector>(null);
  // Effect for build layer
  React.useEffect(() => {
    const buildDrawInteractionAndLayer = () => {
      const sourceOptions = {
        snapshotable: props.snapshotable === true,
        listable: props.listable === true
      };
      const layerProps = {
        uid: props.layerUid,
        name: props.name != null ? props.name : 'Draw',
        layerStyles: props.styles != null ? props.styles : getDefaultLayerStyles()
      };
      const localVectorSource = context.layersManager.createAndAddLayerFromSourceDefinition(
        SourceTypeEnum.LocalVector,
        sourceOptions,
        layerProps
      ) as LocalVector;
      setUid(props.layerUid);
      setSource(localVectorSource);
    };
    buildDrawInteractionAndLayer();
    // Cleanup function
    return () => {
      if (uid != null && props.persist !== true) {
        context.layersManager.removeLayer(uid);
        setUid(null);
        setSource(null);
      }
    };
  }, [props.layerUid, props.styles, props.name, props.snapshotable, props.listable]);
  return source;
}