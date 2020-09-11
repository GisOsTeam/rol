import * as React from 'react';
import styled from 'styled-components';
import { jsPDF } from 'jspdf';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';
import { useOlMap, useTranslate, useDrawSource, useDrawInteraction } from '../hook';
import { exportToImage } from '@gisosteam/aol/utils';
import OlFeature from 'ol/Feature';
import { fromExtent } from 'ol/geom/Polygon';
import Projection from 'ol/proj/Projection';
import { getPointResolution } from 'ol/proj';

const Container = styled.div`
  margin: 2px;
`;

const Button = styled.button`
  height: 32px;
  width: 32px;
  background-color: rgba(213, 213, 213, 0.61);
  border-style: solid;
  border-color: rgba(172, 172, 172, 0.61);
  border-width: 1px;
  border-radius: 5px;
  color: #242424;
  box-shadow: none;
  :disabled {
    color: rgb(152, 152, 152);
    background-color: rgba(175, 175, 175, 0.61);
  }
`;

const ButtonPrint = styled(Button)`
  display: inline;
  ::after {
    content: '⎙';
  }
`;

const ButtonFit = styled(Button)`
  display: inline;
  ::after {
    content: '⤢';
  }
`;

const ButtonCenter = styled(Button)`
  display: inline;
  ::after {
    content: '⛶';
  }
`;

const ButtonCancel = styled(Button)`
  display: inline;
  ::after {
    content: '🗙';
  }
`;

// constants
const dims: { [format: string]: [number, number] } = {
  A1: [841, 594],
  A2: [594, 420],
  A3: [420, 297],
  A4: [297, 210],
};

const formats: { [format: string]: string } = {
  A1: 'A1',
  A2: 'A2',
  A3: 'A3',
  A4: 'A4',
};

const orientations: { [orientation: string]: string } = {
  landscape: 'Landscape',
  portrait: 'Portrait',
};

const scales: { [scale: string]: string } = {
  500: '1 / 500',
  1000: '1 / 1 000',
  2000: '1 / 2 000',
  5000: '1 / 5 000',
  10000: '1 / 10 000',
  20000: '1 / 20 000',
  50000: '1 / 50 000',
  100000: '1 / 100 000',
  200000: '1 / 200 000',
  500000: '1 / 500 000',
  1000000: '1 / 1 000 000',
  2000000: '1 / 2 000 000',
  5000000: '1 / 5 000 000',
  10000000: '1 / 10 000 000',
};

const mm2m = 0.001;

const mm2inch = 25.4;

// Canceling is global tool variable
let canceling = false;

export interface IPrintContentProps extends IFunctionBaseWindowToolProps {}

export function PrintContent(props: IPrintContentProps) {
  const olMap = useOlMap();
  const translate = useTranslate();
  const [formValue, setFormValue] = React.useState<{ [key: string]: string }>({});
  const [center, setCenter] = React.useState<[number, number] | null>(null);
  const [printing, setPrinting] = React.useState<boolean>(false);

  const rectSource = useDrawSource({
    layerUid: 'print_layer_tool',
  });

  React.useEffect(() => {
    setFormValue({
      format: 'A4',
      orientation: 'landscape',
      scale: '20000',
    });
  }, []);

  const computePdfSize = (format: string, orientation: string): [number, number] => {
    let pdfWidth = dims[format][0];
    let pdfHeight = dims[format][1];
    if (orientation === 'portrait') {
      const tmp = pdfWidth;
      pdfWidth = pdfHeight;
      pdfHeight = tmp;
    }
    return [pdfWidth, pdfHeight];
  };

  const computeImageSize = (
    format: string,
    orientation: string,
    resolution: number,
    marginLeft: number,
    marginTop: number,
    marginRight: number,
    marginBottom: number
  ): [number, number] => {
    const pdfSize = computePdfSize(format, orientation);
    const innerWidth = pdfSize[0] - marginLeft - marginRight;
    const innerHeight = pdfSize[1] - marginTop - marginBottom;
    let imageWidth = (innerWidth * resolution) / mm2inch;
    let imageHeight = (innerHeight * resolution) / mm2inch;
    imageWidth = Math.round(imageWidth);
    imageHeight = Math.round(imageHeight);
    return [imageWidth, imageHeight];
  };

  const computeRectangle = (
    format: string,
    orientation: string,
    center: [number, number],
    projection: Projection,
    scale: number,
    marginLeft: number,
    marginTop: number,
    marginRight: number,
    marginBottom: number
  ): [number, number, number, number] => {
    const pdfSize = computePdfSize(format, orientation);
    const innerWidth = pdfSize[0] - marginLeft - marginRight;
    const innerHeight = pdfSize[1] - marginTop - marginBottom;
    const pointResolution = getPointResolution(projection, 1, center);
    const rectWidth = (innerWidth * mm2m * scale) / pointResolution;
    const rectHeight = (innerHeight * mm2m * scale) / pointResolution;
    return [
      center[0] - rectWidth / 2,
      center[1] - rectHeight / 2,
      center[0] + rectWidth / 2,
      center[1] + rectHeight / 2,
    ] as [number, number, number, number];
  };

  const buildPdf = (
    format: string,
    orientation: string,
    dataUrl: string,
    imageFormat: string,
    marginLeft: number,
    marginTop: number,
    marginRight: number,
    marginBottom: number
  ) => {
    const pdf = new jsPDF(orientation as any, 'mm', format);
    pdf.addImage(
      dataUrl,
      imageFormat,
      marginLeft,
      marginTop,
      dims[format][0] - marginLeft - marginRight,
      dims[format][1] - marginTop - marginBottom
    );
    pdf.save('map.pdf');
  };

  const drawRect = () => {
    if (formValue.format == null || formValue.orientation == null || formValue.scale == null) {
      return;
    }
    rectSource.clear();
    rectSource.addFeature(
      new OlFeature({
        geometry: fromExtent(
          computeRectangle(
            formValue.format,
            formValue.orientation,
            center,
            olMap.getView().getProjection(),
            +formValue.scale,
            10,
            30,
            10,
            10
          )
        ),
      })
    );
  };

  const handleChangeInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    setFormValue((formValue) => ({
      ...formValue,
      [key]: value,
    }));
  };

  const handleChangeSelect = (key: string) => (e: React.ChangeEvent<{ name?: string; value: string }>) => {
    e.preventDefault();
    const value = e.target.value;
    setFormValue((formValue) => ({
      ...formValue,
      [key]: value,
    }));
  };

  const handlePrintButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPrinting(true);
    canceling = false;
    const dpi = 150;
    const imageSize = computeImageSize(formValue.format, formValue.orientation, dpi, 10, 30, 10, 10);
    const rect = rectSource.getFeatures()[0].getGeometry().getExtent();
    exportToImage(olMap, imageSize, rect, 'JPEG', () => canceling)
      .then(
        (dataUrl) => {
          buildPdf(formValue.format, formValue.orientation, dataUrl, 'JPEG', 10, 30, 10, 10);
        },
        (err) => {
          console.error(err);
        }
      )
      .finally(() => {
        setPrinting(false);
        canceling = false;
      });
  };

  const handleFitButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    olMap.getView().fit(rectSource.getFeatures()[0].getGeometry().getExtent());
  };

  const handleCenterButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCenter(olMap.getView().getCenter() as [number, number]);
  };

  const handleCancelButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (printing) {
      canceling = true;
    }
  };

  if (!props.open) {
    if (rectSource) {
      rectSource.clear();
    }
    return null;
  }

  if (center == null) {
    setCenter(olMap.getView().getCenter() as [number, number]);
  } else {
    drawRect();
  }

  return (
    <Container className={props.className}>
      <div>
        <label htmlFor="title">{translate('print.title', 'Title')}</label>
        <input id="title" type="text" value={formValue.title} onChange={handleChangeInput('title')} />
      </div>
      <div>
        <label htmlFor="subtitle1">{translate('print.subtitle1', 'Subtitle 1')}</label>
        <input id="subtitle1" type="text" value={formValue.title} onChange={handleChangeInput('subtitle1')} />
      </div>
      <div>
        <label htmlFor="subtitle2">{translate('print.subtitle2', 'Subtitle 2')}</label>
        <input id="subtitle2" type="text" value={formValue.title} onChange={handleChangeInput('subtitle2')} />
      </div>
      <div>
        <label htmlFor="format">{translate('print.format', 'Format')}</label>
        <select id="format" value={formValue.format} onChange={handleChangeSelect('format')}>
          {Object.keys(formats).map((key: string) => {
            return (
              <option value={key} key={key}>
                {formats[key]}
              </option>
            );
          })}
        </select>
      </div>
      <div>
        <label htmlFor="orientation">{translate('print.format', 'Format')}</label>
        <select id="orientation" value={formValue.orientation} onChange={handleChangeSelect('orientation')}>
          {Object.keys(orientations).map((key: string) => {
            return (
              <option value={key} key={key}>
                {orientations[key]}
              </option>
            );
          })}
        </select>
      </div>
      <div>
        <label htmlFor="scale">{translate('print.scale', 'Scale')}</label>
        <select value={formValue.scale} onChange={handleChangeSelect('scale')}>
          {Object.keys(scales).map((key: string) => {
            return (
              <option value={key} key={key}>
                {scales[key]}
              </option>
            );
          })}
        </select>
      </div>
      <div>
        <ButtonPrint
          className={`${props.className}-print`}
          onClick={handlePrintButtonClick}
          title={translate('print.print', 'Print')}
          disabled={printing}
        />
        <ButtonFit
          className={`${props.className}-fit`}
          onClick={handleFitButtonClick}
          title={translate('print.fit', 'Fit the view to the print rectangle')}
        />
        <ButtonCenter
          className={`${props.className}-center`}
          onClick={handleCenterButtonClick}
          title={translate('print.center', 'Move the print rectangle to center of the view')}
        />
        <ButtonCancel
          className={`${props.className}-cancel`}
          onClick={handleCancelButtonClick}
          title={translate('print.cancel', 'Cancel')}
          disabled={!printing}
        />
      </div>
    </Container>
  );
}
