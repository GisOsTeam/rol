import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  border: blue solid 1px;
  width: 350px;
  overflow-y: auto;
  overflow-x: hidden;
  
  table {
    border-collapse: collapse;
  }
  
  thead {
    text-align: center
    border-color: darkblue;
    border-bottom-style: solid;
    border-width: 1px;
  }
  
  tr {
    width: 100%;
  }

  td {
    width: 100%;
  }

  tr.odd {
    background-color: lavender;
  }

  tr.selected {
    background-color: rgba(115, 227, 241, 0.575);
  }
`;

export interface ITableFeature {
  [key: string]: string[];
}

export interface ITableProps {
  feature: ITableFeature;
  header?: string[];
  highlightedKeys?: number[];
  onClickRow?: (key: string, value: string, index?: number, event?: React.MouseEvent) => void;
}

export function objectToITableFeature(inObject: { [key: string]: any }): ITableFeature {
  const featureSummary: ITableFeature = {};
  Object.keys(inObject)
    .filter(prop => typeof inObject[prop] !== 'object')
    .forEach(key => {
      if (!featureSummary[key]) {
        featureSummary[key] = [];
      }

      const currentVal = inObject[key];
      if (currentVal instanceof Array) {
        currentVal.forEach(val => {
          featureSummary[key].push(val);
        });
      } else {
        featureSummary[key].push(currentVal.toString());
      }
    });
  return featureSummary;
}

export const Table: React.FC<any> = ({ feature, header, onClickRow, highlightedKeys }: ITableProps) => {
  let rows: React.ReactElement[] = [];
  let nbRows = 0;

  const renderVal = (key: string, value: string, index: number) => {
    ++nbRows;
    return (
      <tr
        className={`tab-layer-row ${nbRows % 2 ? 'odd' : 'even'} ${
          highlightedKeys && highlightedKeys.includes(nbRows - 1) ? 'selected' : ''
        }`}
        key={`layerTab-${key}-${value}-${index}`}
        onClick={e => (onClickRow ? onClickRow(key, value, nbRows - 1, e) : null)}
      >
        <td className="label-cell">{key}</td>
        <td className="value-cell">{value}</td>
      </tr>
    );
  };

  Object.keys(feature).forEach((key: string, propIndex) => {
    const value = feature[key];
    const htmlElems = value.map((val, index) => renderVal(key, val, index));
    rows = [...rows, ...htmlElems];
  });

  const renderHeader = () => {
    if (header && header.length > 2) {
      console.error("Table component doesn't support more than 2 header columns")
      return;
    }
    if (header) {
      const headContent: JSX.Element[] = [];
      header.forEach((columnLabel, id) => {
        headContent.push(<th colSpan={3 - header.length} key={`${columnLabel}-${id}`}>{columnLabel}</th>);
      });
      return (<thead>{headContent}</thead>);
    }
  };

  return (
    <Container>
      <table>
        {renderHeader()}
        <tbody>{rows}</tbody>
      </table>
    </Container>
  );
};
