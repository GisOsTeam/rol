import * as React from 'react';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';
import { useTranslate } from '../hook/useTranslate';

export function IdentifyHeader(props: IFunctionBaseWindowToolProps) {
  const translate = useTranslate();
  return <span>{translate('identify.header', 'Identify')}</span>;
}
