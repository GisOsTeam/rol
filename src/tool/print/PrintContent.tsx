import * as React from 'react';
import styled from 'styled-components';
import { jsPDF as JsPDF } from 'jspdf';
import { IFunctionBaseWindowToolProps } from '../BaseWindowTool';
import { useOlMap, useTranslate, useDrawSource, useTranslateInteraction, useLayersManager } from '../hook';
import { exportToImage, exportLegendToImage } from '@gisosteam/aol/utils';
import OlFeature from 'ol/Feature';
import { fromExtent } from 'ol/geom/Polygon';
import Projection from 'ol/proj/Projection';
import { getPointResolution } from 'ol/proj';
import { IExtended } from '@gisosteam/aol/source/IExtended';
import { ILayerElement } from '../../LayersManager';

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

const defaultMargins: { [scale: string]: number } = {
  left: 10,
  top: 15,
  right: 10,
  bottom: 10,
};

const defaultImageMargins: { [scale: string]: number } = {
  left: 10,
  top: 15,
  right: 60,
  bottom: 10,
};

const mm2m = 0.001;
const mm2inch = 25.4;
const pt2mm = 0.28;

// Canceling is global tool variable
let canceling = false;

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

const computeMapImageSize = (
  format: string,
  orientation: string,
  dpi: number,
  imageMargins: { [scale: string]: number }
): [number, number] => {
  const pdfSize = computePdfSize(format, orientation);
  const innerWidth = pdfSize[0] - imageMargins.left - imageMargins.right;
  const innerHeight = pdfSize[1] - imageMargins.top - imageMargins.bottom;
  let imageWidth = (innerWidth * dpi) / mm2inch;
  let imageHeight = (innerHeight * dpi) / mm2inch;
  imageWidth = Math.round(imageWidth);
  imageHeight = Math.round(imageHeight);
  return [imageWidth, imageHeight];
};

const computeLegendImageSize = (
  format: string,
  orientation: string,
  dpi: number,
  margins: { [scale: string]: number },
  imageMargins: { [scale: string]: number }
): [number, number] => {
  const pdfSize = computePdfSize(format, orientation);
  const innerWidth = imageMargins.right - margins.right;
  const innerHeight = pdfSize[1] - margins.top - margins.bottom - 95;
  let imageWidth = (innerWidth * dpi) / mm2inch;
  let imageHeight = (innerHeight * dpi) / mm2inch;
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
  imageMargins: { [scale: string]: number }
): [number, number, number, number] => {
  const pdfSize = computePdfSize(format, orientation);
  const innerWidth = pdfSize[0] - imageMargins.left - imageMargins.right;
  const innerHeight = pdfSize[1] - imageMargins.top - imageMargins.bottom;
  const pointResolution = getPointResolution(projection, 1, center);
  const rectWidth = (innerWidth * mm2m * scale) / pointResolution;
  const rectHeight = (innerHeight * mm2m * scale) / pointResolution;
  return [
    center[0] - rectWidth / 2,
    center[1] - rectHeight / 2,
    center[0] + rectWidth / 2,
    center[1] + rectHeight / 2
  ] as [number, number, number, number];
};

export interface IPrintContentProps extends IFunctionBaseWindowToolProps {
  onPrintStart?: () => void;
  onPrintEnd?: (pdf?: JsPDF) => void;
}

export const defaultPrintEnd = (pdf?: JsPDF) => {
  if (pdf) {
    pdf.save('map.pdf');
  }
};
export function PrintContent(props: IPrintContentProps) {
  const olMap = useOlMap();
  const layersManager = useLayersManager();
  const translate = useTranslate();
  const [formValue, setFormValue] = React.useState<{ [key: string]: string }>({});
  const [center, setCenter] = React.useState<[number, number] | null>(null);
  const [printing, setPrinting] = React.useState<boolean>(false);

  const { onPrintEnd = defaultPrintEnd, onPrintStart } = props;

  const rectSource = useDrawSource({
    layerUid: 'print-tool-draw-source',
  });

  useTranslateInteraction({ source: rectSource, activated: props.activated && !printing });

  React.useEffect(() => {
    setFormValue({
      format: 'A4',
      orientation: 'landscape',
      scale: '20000',
    });
  }, []);

  const buildPdf = React.useCallback(
    (
      format: string,
      orientation: string,
      mapDataUrl: string,
      mapImageFormat: string,
      legendDataUrl: string,
      legendImageFormat: string,
      margin: { [scale: string]: number },
      imageMargin: { [scale: string]: number }
    ) => {
      const pdf = new JsPDF(orientation as any, 'mm', format);
      const pdfSize = computePdfSize(format, orientation);
      pdf.addImage(
        mapDataUrl,
        mapImageFormat,
        margin.left,
        margin.top,
        pdfSize[0] - imageMargin.left - imageMargin.right,
        pdfSize[1] - imageMargin.top - imageMargin.bottom
      );
      pdf.addImage(
        legendDataUrl,
        legendImageFormat,
        pdfSize[0] - imageMargin.right,
        margin.top,
        imageMargin.right - margin.right,
        pdfSize[1] - margin.top - margin.bottom
      );
      if (formValue.title != null) {
        pdf.text(formValue.title, dims[format][0] / 2, 10, { align: 'center' });
      }

      onPrintEnd(pdf);
    },
    [onPrintEnd]
  );

  const drawRect = () => {
    if (formValue.format == null || formValue.orientation == null || formValue.scale == null || center == null) {
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
            defaultImageMargins
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
    if (onPrintStart) {
      onPrintStart();
    }
    canceling = false;
    const dpi = mm2inch / pt2mm;
    const mapImageSize = computeMapImageSize(formValue.format, formValue.orientation, dpi, defaultImageMargins);
    const legendImageSize = computeLegendImageSize(
      formValue.format,
      formValue.orientation,
      2 * dpi,
      defaultMargins,
      defaultImageMargins
    );
    const rect = rectSource.getFeatures()[0].getGeometry().getExtent();
    rectSource.clear();

    const sources: IExtended[] = [];
    const layerElements = layersManager.getLayerElements((layerElement: ILayerElement) => {
      const source = layerElement.reactElement.props.source;
      const visible = layerElement.reactElement.props.visible;
      return (
        source != null &&
        typeof source.isListable === 'function' &&
        typeof source.fetchLegend === 'function' &&
        (source as IExtended).isListable() &&
        visible !== false
      );
    });
    for (const layerElement of layerElements) {
      sources.push(layerElement.reactElement.props.source);
    }

    Promise.all([
      exportToImage(olMap, mapImageSize, rect, 'JPEG', () => canceling),
      exportLegendToImage(sources, legendImageSize, 'JPEG', () => canceling),
    ])
      .then(
        ([mapDataUrl, legendDataUrl]) => {
          buildPdf(
            formValue.format,
            formValue.orientation,
            mapDataUrl,
            'JPEG',
            legendDataUrl,
            'JPEG',
            defaultMargins,
            defaultImageMargins
          );
        },
        (err) => {
          onPrintEnd();
          console.error(err);
        }
      )
      .finally(() => {
        setPrinting(false);
        canceling = false;
        drawRect();
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
        <label htmlFor="orientation">{translate('print.orientation', 'Orientation')}</label>
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
        {printing ? (
          <p>{translate('print.instructionPrinting', 'Please do not interfere on the map during printing')}</p>
        ) : (
          <p>{translate('print.instruction', 'Please set the printing area on the map.')}</p>
        )}
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
          disabled={printing}
        />
        <ButtonCenter
          className={`${props.className}-center`}
          onClick={handleCenterButtonClick}
          title={translate('print.center', 'Move the print rectangle to center of the view')}
          disabled={printing}
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
