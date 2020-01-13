import * as React from 'react';
import styled from 'styled-components';
import { rolContext } from '../../RolContext';
import { useTranslate } from '../hook/useTranslate';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const DropZone = styled.div`
  width: 300px;
  height: 150px;
  line-height: 150px;
  border: 2px dashed #0087f7;
  border-radius: 5px;
  background: white;
  cursor: pointer;
  color: #646c7f;
  text-align: center;
  vertical-align: middle;
`;

const DropZoneText = styled.span`
  display: inline-block;
  vertical-align: middle;
  line-height: normal;
`;

export interface ISelectorType {
  type: string;
  description: string;
  content?: (props?: unknown) => React.ReactNode;
}

export interface IFileSelectorProps extends IFunctionBaseWindowToolProps {
  selectorTypes: ISelectorType[];

  /**
   * Props Transferred to content
   */
  selectorsProps?: any;

  className?: string;
  onTypeSelected?: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Selector = (props: IFileSelectorProps) => {
  const selectorTypeMap: { [type: string]: ISelectorType } = {};
  props.selectorTypes.forEach((selectorType: ISelectorType) => {
    selectorTypeMap[selectorType.type] = selectorType;
  });

  const [currentSelectorType, setCurrentSelectorType] = React.useState<ISelectorType | null>(null);
  const translate = useTranslate();

  const className = `${props.className ? props.className : 'file-selector'}`;

  return (
    <Container className={className}>
      <select
        className="form-control"
        value={currentSelectorType ? currentSelectorType.type : ''}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setCurrentSelectorType(selectorTypeMap[e.currentTarget.value]);
          if (props.onTypeSelected) {
            props.onTypeSelected(e);
          }
        }}
      >
        <option value="">{translate('selector.type', 'Select type')}</option>
        {props.selectorTypes.map((selectorType: ISelectorType) => {
          return (
            <option key={selectorType.type} value={selectorType.type}>
              {selectorType.description}
            </option>
          );
        })}
      </select>
      {currentSelectorType && currentSelectorType.content({ ...props.selectorsProps })}
    </Container>
  );
};
