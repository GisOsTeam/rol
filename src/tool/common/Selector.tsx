import * as React from 'react';
import styled from 'styled-components';
import { rolContext } from '../../RolContext';
import { useTranslate } from '../hook/useTranslate';

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
  // TODO: Del & move fileDropZone to content
  showFileDropZone?: boolean;
  content?: (props?: unknown) => React.ReactNode;
}

export interface IFileSelectorProps {
  selectorTypes: ISelectorType[];
  selectorsProps?: any;
  className?: string;
  onTypeSelected: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
  onFileSelected: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Selector = (props: IFileSelectorProps ) => {
  const selectorTypeMap: { [type: string]: ISelectorType } = {};
  props.selectorTypes.forEach((selectorType: ISelectorType) => {
    selectorTypeMap[selectorType.type] = selectorType;
  });

  const [selectorType, setSelectorType] = React.useState<ISelectorType | null>(null);
  const translate = useTranslate();

  const className = `${props.className ? props.className : 'file-selector'}`;

  const inputFileRef = React.createRef<HTMLInputElement>();

  return (
    <rolContext.Consumer>
      {context => (
        <Container className={className}>
          <select
            className="form-control"
            value={selectorType ? selectorType.type : ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setSelectorType(selectorTypeMap[e.currentTarget.value]);
              props.onTypeSelected(e);
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
          {selectorType && selectorType.showFileDropZone == true && (
            <div onClick={() => inputFileRef.current.click()}>
              <input
                ref={inputFileRef}
                type="file"
                style={{ display: 'none' }}
                onChange={props.onFileSelected}
                accept={selectorType.type}
              />
              <DropZone>
                <DropZoneText>{translate('selector.dropzone', 'Drop file here or click to upload.')}</DropZoneText>
              </DropZone>
            </div>
          )}
          {selectorType && selectorType.content({ ...props.selectorsProps })}
        </Container>
      )}
    </rolContext.Consumer>
  );
};
