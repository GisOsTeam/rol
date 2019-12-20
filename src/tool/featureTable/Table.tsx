import * as React from 'react';

export interface ITableFeature {
  [key: string]: string[];
}
export interface ITableProps {
  feature: ITableFeature;

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
export const Table: React.FC<any> = ({ feature, onClickRow, highlightedKeys }: ITableProps) => {
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

  return (
    <table className="feature-table">
      <tbody>{rows}</tbody>
    </table>
  );
};
