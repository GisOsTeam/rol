import * as React from 'react';
import { useIdentify, IIdentifyResponse } from './hook/useIdentify';
import { IBaseToolProps, withBaseTool } from './BaseTool';
export const Identify = withBaseTool((props: IBaseToolProps) : React.ReactElement => {
    useIdentify({
        activated: (props.activated ? props.activated : false),
        callBack: (identifyResp: IIdentifyResponse) => {
            console.log("identifyResp", identifyResp);
        }
    });    
    return null;
});