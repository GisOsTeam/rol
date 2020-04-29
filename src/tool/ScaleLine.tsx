import * as React from 'react';
import styled from 'styled-components';
import { getPointResolution } from 'ol/proj';
import OlUnits from 'ol/proj/Units';
import { rolContext, IRolContext } from '../RolContext';
import { BaseTool, IBaseToolProps } from './BaseTool';

const Container = styled.div`
  top: 15px;
  left: 15px;
  margin: 0px;
  padding-top: 0px;
  padding-bottom: 2px;
  padding-left: 4px;
  padding-right: 4px;
  background-color: rgba(213, 213, 213, 0.61);
  border-style: solid;
  border-color: rgba(172, 172, 172, 0.61);
  border-width: 1px;
  border-radius: 5px;
  color: #242424;
  box-shadow: none;
`;

const Inner = styled.div`
  display: inline-block;
  margin: 0px;
  padding: 0px;
  height: 4px;
`;

const Parts = styled.div`
  margin: 0px;
  padding: 0px;
  width: 100%;
`;

const Part1 = styled.div`
  display: inline-block;
  margin: 0px;
  padding: 0px;
  height: 4px;
  width: 50%;
  background-color: #333;
`;

const Part2 = styled.div`
  display: inline-block;
  margin: 0px;
  padding: 0px;
  height: 4px;
  width: 50%;
  background-color: #555;
`;

const Label = styled.div`
  display: inline-block;
  margin: 0px;
  padding: 0px;
  margin-left: 4px;
  text-align: center;
  vertical-align: bottom;
  font-weight: 400;
  font-size: 12px;
`;

const LEADING_DIGITS = [1, 2, 5];

export interface IScaleLineProps extends IBaseToolProps {
  /**
   * Class name.
   */
  className?: string;
  /**
   * Min Width name.
   */
  minWidth?: number;
}

export class ScaleLine extends BaseTool<IScaleLineProps, any> {
  public static contextType: React.Context<IRolContext> = rolContext;

  public static defaultProps = {
    ...BaseTool.defaultProps,
    className: 'scaleline',
    minWidth: 64,
  };

  public context: IRolContext;

  /**
   * Div ScaleLine.
   */
  private divScaleLine: any;

  /**
   * Div ScaleLine Inner.
   */
  private divScaleLineInner: any;

  /**
   * Div ScaleLine Label.
   */
  private divScaleLineLabel: any;

  public toolDidConstruct() {
    this.context.olMap.on('change:view', this.onViewChange);
    setTimeout(() => {
      this.onViewChange();
    }, 100);
  }

  public onViewChange = () => {
    this.context.olMap.getView().on('propertychange', this.onResolutionChange);
    this.onResolutionChange();
  };

  public onResolutionChange = () => {
    if (this.divScaleLine == null) {
      return;
    }
    const view = this.context.olMap.getView();
    if (view == null) {
      return;
    }
    const projection = view.getProjection();
    const units = projection.getUnits();
    const center = view.getCenter();
    const resolution = view.getResolution();

    let pointResolution = getPointResolution(projection, resolution, center, OlUnits.METERS);

    const nominalCount = this.props.minWidth * pointResolution;
    let suffix = '';
    if (units == null) {
      return;
    }
    if (units.match(/m/i) || units.match(/meter/i) || units.match(/d/i) || units.match(/degree/i)) {
      if (nominalCount < 0.001) {
        suffix = 'μm';
        pointResolution *= 1000000;
      } else if (nominalCount < 1) {
        suffix = 'mm';
        pointResolution *= 1000;
      } else if (nominalCount < 1000) {
        suffix = 'm';
      } else {
        suffix = 'km';
        pointResolution /= 1000;
      }
    } else if (units.match(/ft/i) || units.match(/feet/i) || units.match(/foot/i)) {
      if (nominalCount < 0.9144) {
        suffix = 'in';
        pointResolution *= 39.37;
      } else if (nominalCount < 1609.344) {
        suffix = 'ft';
        pointResolution /= 0.30480061;
      } else {
        suffix = 'mi';
        pointResolution /= 1609.3472;
      }
    } else {
      return;
    }

    let i = 3 * Math.floor(Math.log(this.props.minWidth * pointResolution) / Math.log(10));
    let count;
    let width;
    while (true) {
      count = LEADING_DIGITS[((i % 3) + 3) % 3] * Math.pow(10, Math.floor(i / 3));
      width = Math.round(count / pointResolution);
      if (isNaN(width)) {
        this.divScaleLine.style.display = 'none';
        return;
      } else if (width >= this.props.minWidth) {
        break;
      }
      ++i;
    }

    this.divScaleLine.style.display = '';

    const label = count + ' ' + suffix;
    this.divScaleLineLabel.innerHTML = label;

    this.divScaleLineInner.style.width = width + 'px';
  };

  public componentWillUnmount() {
    this.context.olMap.getView().un('propertychange', this.onResolutionChange);
    this.context.olMap.un('change:view', this.onViewChange);
  }

  public renderTool(): React.ReactNode {
    if (this.props.disabled === true) {
      return null;
    }
    const scanlineTitle = this.context.translate('scanline.title', 'Diagonal distance in map center');
    return (
      <Container
        ref={(divScaleLine) => {
          this.divScaleLine = divScaleLine;
        }}
        className={`${this.props.className} ol-unselectable ol-control`}
        title={scanlineTitle}
      >
        <Inner
          ref={(divScaleLineInner) => {
            this.divScaleLineInner = divScaleLineInner;
          }}
          className={`${this.props.className}-inner`}
        >
          <Parts className={`${this.props.className}-parts`}>
            <Part1 className={`${this.props.className}-part1`} />
            <Part2 className={`${this.props.className}-part2`} />
          </Parts>
        </Inner>
        <Label
          ref={(divScaleLineLabel) => {
            this.divScaleLineLabel = divScaleLineLabel;
          }}
          className={`${this.props.className}-label`}
        />
      </Container>
    );
  }
}
