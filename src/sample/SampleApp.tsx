import * as React from 'react';
import { Rol, IAfterData } from '../Rol';
import OlView from 'ol/View';
import { CounterButton } from './CounterButton';
import { CounterButtonFunction } from './CounterButtonFunction';
import { CounterWindow } from './CounterWindow';
import { CounterWindowFunction } from './CounterWindowFunction';
import { TileArcGISRest } from '@gisosteam/aol/source/TileArcGISRest';
import { ImageStatic } from '@gisosteam/aol/source/ImageStatic';
import { TileWms } from '@gisosteam/aol/source/TileWms';
import { ImageArcGISRest } from '@gisosteam/aol/source/ImageArcGISRest';
import { Xyz } from '@gisosteam/aol/source/Xyz';
import { Control } from '../container/Control';
import { Zone } from '../container/Zone';
import { Fullscreen } from '../tool/Fullscreen';
import { Toc } from '../tool/Toc';
import { ScaleLine } from '../tool/ScaleLine';
import { PanZoom } from '../tool/PanZoom';
import { LayerLoader } from '../tool/LayerLoader';
import { Identify } from '../tool/Identify';
import { PreviousViewButton } from '../tool/navigation/PreviousViewButton';
import { Reproj } from '../tool/Reproj';
import { Image } from '../layer/Image';
import { Tile } from '../layer/Tile';
import { Projection } from '../Projection';
import { ShowSnapshot } from './ShowSnapshot';
import { DrawLine } from './DrawLine';

const wkt2154 =
  'PROJCS["RGF93 / Lambert-93",GEOGCS["RGF93",DATUM["Reseau_Geodesique_Francais_1993",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6171"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4171"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",49],PARAMETER["standard_parallel_2",44],PARAMETER["latitude_of_origin",46.5],PARAMETER["central_meridian",3],PARAMETER["false_easting",700000],PARAMETER["false_northing",6600000],AUTHORITY["EPSG","2154"],AXIS["X",EAST],AXIS["Y",NORTH]]';
const wkt27700 =
  'PROJCS["OSGB 1936 / British National Grid",GEOGCS["OSGB 1936",DATUM["OSGB_1936",SPHEROID["Airy 1830",6377563.396,299.3249646,AUTHORITY["EPSG","7001"]],AUTHORITY["EPSG","6277"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4277"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",49],PARAMETER["central_meridian",-2],PARAMETER["scale_factor",0.9996012717],PARAMETER["false_easting",400000],PARAMETER["false_northing",-100000],AUTHORITY["EPSG","27700"],AXIS["Easting",EAST],AXIS["Northing",NORTH]]';

const osm = new Xyz({
  url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  projection: 'EPSG:3857',
});

const world2D = new TileArcGISRest({
  url: 'https://services.arcgisonline.com/arcgis/rest/services/ESRI_Imagery_World_2D/MapServer',
  // url: 'http://localhost:8181/aHR0cHM6Ly9zZXJ2aWNlcy5hcmNnaXNvbmxpbmUuY29tL2FyY2dpcy9yZXN0L3NlcnZpY2VzL0VTUklfSW1hZ2VyeV9Xb3JsZF8yRA%3D%3D/MapServer',
  projection: 'EPSG:3857',
} as any);

const britishNationalGrid = new ImageStatic({
  url:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/British_National_Grid.svg/2000px-British_National_Grid.svg.png',
  projection: 'EPSG:27700',
  imageExtent: [0, 0, 700000, 1300000],
});

const toppStateSource = new TileWms({
  url: 'https://ahocevar.com/geoserver/wms',
  types: [{ id: 'topp:states' }],
} as any);

const highways = new ImageArcGISRest({
  url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
  types: [{ id: 1 }],
} as any);

export class SampleApp extends React.Component<{}, { hideTools: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { hideTools: false };
  }

  public setHideTools = (hideTools: boolean) => {
    this.setState({ hideTools });
  };

  public render(): React.ReactNode {
    return (
      <Rol
        uid="map"
        keyboardEventTarget={document}
        olMapStyle={{ width: '100%', height: '600px' }}
        afterMount={(afterData: IAfterData) => {
          afterData.olMap.setView(
            new OlView({
              center: [490000, 6800000],
              zoom: 5,
              projection: 'EPSG:3857',
            })
          );
        }}
      >
        <Projection
          code="EPSG:2154"
          name="RGF93 / Lambert-93"
          wkt={wkt2154}
          lonLatValidity={[-9.86, 41.15, 10.38, 51.56]}
        />
        <Projection
          code="EPSG:27700"
          name="OSGB 1936 / British National Grid"
          wkt={wkt27700}
          lonLatValidity={[-8.82, 49.79, 1.92, 60.94]}
        />
        <Tile uid="UID -- OSM" source={osm} name="OSM" type="BASE" visible={true} />
        <Tile uid="UID -- World 2D" source={world2D} name="World 2D" type="BASE" />
        <Tile
          uid="UID -- Topp States"
          source={toppStateSource}
          name="Topp States"
          description="Topp States WMS Layer"
        />
        <Image uid="UID -- Highways" source={highways} name="Highways" />
        <Image uid="UID -- British National Grid" source={britishNationalGrid} name="British National Grid" />
        <Control>
          {this.state.hideTools === false && (
            <Zone>
              <Toc uid="Toc" />
              <Fullscreen uid="Fullscreen" />
              <PanZoom uid="PanZoom" />
              <ScaleLine uid="ScaleLine" />
              <Zone style={{ position: 'absolute', left: '8px', top: 'calc(100% - 40px)' }}>
                <PreviousViewButton uid="PreviousView" />
                <CounterButton uid="CounterButton" />
                <CounterButtonFunction uid="CounterButtonFunction" />
                <CounterWindow uid="CounterWindow" />
                <CounterWindowFunction uid="CounterWindowFunction" />
                <LayerLoader uid="LayerLoader" />
                <ShowSnapshot uid="ShowSnapshot" />
                <DrawLine uid="DrawLine" />
                <Identify uid="IdentifyTool" />
                <Reproj uid="ReprojTool" />
              </Zone>
            </Zone>
          )}
        </Control>
      </Rol>
    );
  }
}
