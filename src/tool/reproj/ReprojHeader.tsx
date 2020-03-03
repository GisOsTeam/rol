import * as React from 'react';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';
import { useTranslate } from '../hook/useTranslate';

export function ReprojHeader(props: IFunctionBaseWindowToolProps) {
  const translate = useTranslate();
  return <span>{translate('reproj.header', 'Reprojection')}</span>;
}
