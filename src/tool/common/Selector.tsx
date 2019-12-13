import * as React from 'react';
import styled from 'styled-components';
import { rolContext } from '../../RolContext';

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
  showFileDropZone?: boolean;
  content?: React.ReactNode;
}

export interface IFileSelectorProps {
  selectorTypes: ISelectorType[];
  className?: string;
  onTypeSelected: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
  onFileSelected: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Selector = (props: IFileSelectorProps) => {
  const selectorTypeMap: { [type: string]: ISelectorType } = {};
  props.selectorTypes.forEach(selectorType => {
    selectorTypeMap[selectorType.type] = selectorType;
  });

  const [selectorType, setSelectorType] = React.useState<ISelectorType | null>(null);

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
            <option value="">{context.getLocalizedText('selector.type', 'Select type')}</option>
            {props.selectorTypes.map(selectorType => {
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
                <DropZoneText>
                  {context.getLocalizedText('selector.dropzone', 'Drop file here or click to upload.')}
                </DropZoneText>
              </DropZone>
            </div>
          )}
          {selectorType && selectorType.content}
        </Container>
      )}
    </rolContext.Consumer>
  );
};
