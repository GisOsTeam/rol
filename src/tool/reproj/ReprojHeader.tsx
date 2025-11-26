import * as React from 'react';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';
import { useTranslate } from '../hook/useTranslate';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ReprojHeader(props: IFunctionBaseWindowToolProps) {
  const translate = useTranslate();
  return <span>{translate('reproj.header', 'Reprojection')}</span>;
}
