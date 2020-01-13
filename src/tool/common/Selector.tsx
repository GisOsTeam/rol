import * as React from 'react';
import styled from 'styled-components';
import { rolContext } from '../../RolContext';
import { useTranslate } from '../hook/useTranslate';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export interface ISelectorType {
  type: string;
  description: string;
  options?: any;
  content: string
  | React.FunctionComponent<any>
  | React.ComponentClass<any, any>;
}

export interface ISelectorProps {
  selectorTypes: ISelectorType[];

  className?: string;
  onTypeSelected?: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Selector = (props: ISelectorProps) => {
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
      {currentSelectorType && React.createElement(currentSelectorType.content, currentSelectorType.options)}
    </Container>
  );
};
