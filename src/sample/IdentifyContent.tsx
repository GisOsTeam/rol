import * as React from "react";
import { IFeatureType, LayersPrefixEnum } from "@gisosteam/aol/source/IExtended";

import { IBaseToolProps } from "../tool";
import { useDrawSource, useIdentify } from '../tool/hook';
import { Feature } from "ol";
import GeometryType from "ol/geom/GeometryType";


export interface IIdentifyContentProps extends IBaseToolProps {
    tolerance?: number;
    limit?: number;
}

export interface ITypeFeatureResponse { 
    features: Feature[];
    type: IFeatureType<string | number>; 
  }
  
export const DefaultIdentifyContent: React.FunctionComponent<IIdentifyContentProps> = (props: IIdentifyContentProps) => {
   const drawSource = useDrawSource({layerUid: 'identifylayer'});

    /**
     * Lance l'outils d'identification si tool actif + envoie via le contexte le resultat
     * au widget de tableaux de résultats
     */
     useIdentify({
      activated: props.activated,
      typeGeom: GeometryType.POINT,
      tolerance: 5,
      limit: 5,
      layersParam: LayersPrefixEnum.ALL,
      drawSource: drawSource,
      
      onIdentifyResponse: (resp) => console.log("Pwet", resp),
     });
     
    return (
        <>
        </>
    );
};