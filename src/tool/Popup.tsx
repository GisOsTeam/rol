import * as React from 'react';
import { Overlay } from '../container';
import { IIdentifyResponse } from './hook/useIdentify';

export type IPopupProps = IIdentifyResponse;

export function Popup(props: IPopupProps) {
    return <Overlay position={props.position as [number, number]}>
        Content
    </Overlay>
}