import * as React from 'react';
import { Rol, IAfterData } from '../Rol';
import OlView from 'ol/View';
import { CounterButton } from './CounterButton';
import { CounterToggleButton } from './CounterToggleButton';
import { CounterWindow } from './CounterWindow';
import { TileArcGISRest } from '@gisosteam/aol/source/TileArcGISRest';
import { ImageStatic } from '@gisosteam/aol/source/ImageStatic';
import { TileWms } from '@gisosteam/aol/source/TileWms';
import { ImageWms } from '@gisosteam/aol/source/ImageWms';
import { ImageArcGISRest } from '@gisosteam/aol/source/ImageArcGISRest';
import { WmtsCapabilities } from '@gisosteam/aol/source/WmtsCapabilities';
import { Osm } from '@gisosteam/aol/source/Osm';
import { TileWfs } from '@gisosteam/aol/source/TileWfs';
import { Control } from '../container/Control';
import { Zone } from '../container/Zone';
import { ZoomRectangleWidget } from '../tool/navigation/ZoomRectangle';
import { Fullscreen } from '../tool/Fullscreen';
import { Toc } from '../tool/Toc';
import { ScaleLine } from '../tool/ScaleLine';
import { PanZoom, GroupButtonTool, Print, Search } from '../tool';
import { LayerLoader } from '../tool';
import { Identify } from '../tool';
import { PreviousViewButton } from '../tool/navigation/PreviousViewButton';
import { NextViewButton } from '../tool/navigation/NextViewButton';
import { InitialViewButton } from '../tool/navigation/InitialViewButton';
import { ShowSnapshot } from '../tool/ShowSnapshot';
import { DrawLine } from '../tool/draw';
import { Reproj } from '../tool/Reproj';
import { Image } from '../layer/Image';
import { Tile } from '../layer/Tile';
import { VectorTile } from '../layer/VectorTile';
import { Projection } from '../Projection';
import { OneShotCounterButton } from './OneShotCounterButton';
import { BanSearchProvider } from '@gisosteam/aol/search';
import { createXYZ } from 'ol/tilegrid';
import { Xyz } from '@gisosteam/aol/source/Xyz';
import { DefaultIdentify } from './DefaultIdentify';

const wkt2154 =
  'PROJCS["RGF93 / Lambert-93",GEOGCS["RGF93",DATUM["Reseau_Geodesique_Francais_1993",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],TOWGS84[0,0,0,0,0,0,0],AUTHORITY["EPSG","6171"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4171"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",49],PARAMETER["standard_parallel_2",44],PARAMETER["latitude_of_origin",46.5],PARAMETER["central_meridian",3],PARAMETER["false_easting",700000],PARAMETER["false_northing",6600000],AUTHORITY["EPSG","2154"],AXIS["X",EAST],AXIS["Y",NORTH]]';
const wkt27700 =
  'PROJCS["OSGB 1936 / British National Grid",GEOGCS["OSGB 1936",DATUM["OSGB_1936",SPHEROID["Airy 1830",6377563.396,299.3249646,AUTHORITY["EPSG","7001"]],AUTHORITY["EPSG","6277"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4277"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",49],PARAMETER["central_meridian",-2],PARAMETER["scale_factor",0.9996012717],PARAMETER["false_easting",400000],PARAMETER["false_northing",-100000],AUTHORITY["EPSG","27700"],AXIS["Easting",EAST],AXIS["Northing",NORTH]]';

const osm = new Osm({ projection: 'EPSG:3857' });

const worldTopo = new Xyz({
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
});

const worldStreet = new TileArcGISRest({
  url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer',
  projection: 'EPSG:3857',
});

const worldImagery = new TileArcGISRest({
  url: 'https://services.arcgisonline.com/arcgis/rest/services/ESRI_Imagery_World_2D/MapServer',
  // url: 'http://localhost:8181/aHR0cHM6Ly9zZXJ2aWNlcy5hcmNnaXNvbmxpbmUuY29tL2FyY2dpcy9yZXN0L3NlcnZpY2VzL0VTUklfSW1hZ2VyeV9Xb3JsZF8yRA%3D%3D/MapServer',
  projection: 'EPSG:3857',
});

const timeZones = new WmtsCapabilities({
  capabilitiesUrl: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/WorldTimeZones/MapServer/WMTS',
  // capabilitiesUrl: 'http://localhost:8181/aHR0cHM6Ly9zYW1wbGVzZXJ2ZXI2LmFyY2dpc29ubGluZS5jb20vYXJjZ2lzL3Jlc3Qvc2VydmljZXMvV29ybGRUaW1lWm9uZXMvTWFwU2VydmVyL1dNVFM%3D',
  // url: 'http://localhost:8181/aHR0cHM6Ly9zYW1wbGVzZXJ2ZXI2LmFyY2dpc29ubGluZS5jb20vYXJjZ2lzL3Jlc3Qvc2VydmljZXMvV29ybGRUaW1lWm9uZXMvTWFwU2VydmVyL1dNVFM%3D',
  layer: 'WorldTimeZones',
  matrixSet: 'GoogleMapsCompatible',
  requestEncoding: 'KVP',
});

const britishNationalGrid = new ImageStatic({
  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/British_National_Grid.svg/2000px-British_National_Grid.svg.png',
  projection: 'EPSG:27700',
  imageExtent: [0, 0, 700000, 1300000],
});

const toppStateSource = new TileWms({
  url: 'https://ahocevar.com/geoserver/wms',
  types: [{ id: 'topp:states' }],
  params: {},
});

const cities = new ImageWms({
  url: 'https://demo.mapserver.org/cgi-bin/wms',
  types: [{ id: 'cities' }],
  crossOrigin: undefined,
  params: {},
});

const highways = new ImageArcGISRest({
  url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
  types: [{ id: 0 }, { id: 1, name: 'Highways' }],
});

const pk = new ImageWms({
  url: 'https://geo-prep.vnf.fr/adws/service/wms/af073203-0704-11eb-b701-67e74f799165',
  queryWfsUrl: 'https://geo-prep.vnf.fr/adws/service/wfs/1419e291-2e64-11eb-bbe9-f78eb64fe1df',
  types: [{ id: '7a87614a-33e2-11eb-bbe9-f78eb64fe1df', queryId: 'bg:_fa9e74b8-2ffa-11eb-bbe9-f78eb64fe1df' }],
  crossOrigin: undefined,
  params: {},
});

const pkTileWfs = new TileWfs({
  url: 'https://geo-prep.vnf.fr/adws/service/wfs/1419e291-2e64-11eb-bbe9-f78eb64fe1df',
  type: { id: 'bg:_fa9e74b8-2ffa-11eb-bbe9-f78eb64fe1df' },
  limit: 100,
  tileGrid: createXYZ({
    tileSize: 128,
  }),
});

const geodeps = new ImageWms({
  url: 'http://idlv-vnf-dev-app.lyon-dev2.local:8180/geoserver/wms',
  types: [{ id: 'gedo:departements' }],
  crossOrigin: undefined,
  params: {},
});

export class SampleApp extends React.Component<{}, { hide: boolean }> {
  private reloaded = false;

  constructor(props: {}) {
    super(props);

    this.state = { hide: false };
  }

  public render(): React.ReactNode {
    return (
      <>
        {(() => (!this.state.hide ? null : <h1>App visibility: hidden</h1>))()}
        <Rol
          uid="map"
          keyboardEventTarget={document}
          olMapStyle={{ width: '100%', height: '90vh' }}
          afterMount={(afterData: IAfterData) => {
            afterData.olMap.setView(
              new OlView({
                center: [490000, 6800000],
                zoom: 5,
                projection: 'EPSG:3857',
                constrainResolution: true,
              })
            );
          }}
          afterUpdate={(afterData: IAfterData) => {
            if (this.reloaded === false) {
              this.reloaded = true;
              afterData.layersManager.reload();
            }
          }}
          style={{
            visibility: this.state.hide ? 'hidden' : 'unset',
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
          <Tile uid="UID -- World Topo" source={worldTopo} name="World Topo" type="BASE" />
          <Tile uid="UID -- World Street" source={worldStreet} name="World Street" type="BASE" />
          <Tile uid="UID -- World Imagery" source={worldImagery} name="World Imagery" type="BASE" />
          <Tile
            uid="UID -- Time zones"
            source={timeZones}
            name="Time zones"
            description="Time zones WMTS Layer"
            type="BASE"
          />
          <Tile
            uid="UID -- Topp States"
            source={toppStateSource}
            name="Topp States"
            description="Topp States WMS Layer"
          />
          {/* <Image uid="UID -- Cities" source={cities} name="Cities" /> */}
          <Image uid="UID -- Highways" source={highways} name="USA ArcGIS Group" />
          <Image uid="UID -- British National Grid" source={britishNationalGrid} name="British National Grid" />
          <Image uid="UID -- geodeps" source={geodeps} name="geodeps" />
          {/* <Image uid="UID -- PK" source={pk} name="Point kilométrique (WMS/WFS)" /> */}
          {/* <VectorTile uid="UID -- PKTILEWFS" source={pkTileWfs} name="Point kilométrique (TILEWFS)" declutter={true} /> */}
          <Control>
            <Zone>
              <DefaultIdentify uid="Pwet" activated defaultActivated />
              <Toc uid="Toc" independant />
              <Fullscreen uid="Fullscreen" independant />
              <PanZoom uid="PanZoom" independant />
              <ScaleLine uid="ScaleLine" independant />
              <Search uid="Search" searchProvider={new BanSearchProvider()} independant />
              <Zone style={{ position: 'absolute', left: '8px', top: 'calc(100% - 40px)' }}>
                <CounterButton uid="CounterButton" />
                <CounterToggleButton uid="CounterToggleButton" />
                <CounterWindow uid="CounterWindow" toggle={true} />
                <OneShotCounterButton uid="oneshotbtnTool" />
                <CounterButton uid="CounterButton2" />
                <GroupButtonTool
                  btnContent={<label>Group</label>}
                  groupPosition="top"
                  onUnFold={(group) => {
                    console.log(group, group.props.children);
                  }}
                >
                  <PreviousViewButton uid="PreviousView" />
                  <InitialViewButton uid="InitialView" />
                  <NextViewButton uid="NextView" />
                </GroupButtonTool>
                <ZoomRectangleWidget uid="zoomRectangle" />
                <LayerLoader uid="LayerLoader" />
                <ShowSnapshot uid="ShowSnapshot" />
                <DrawLine uid="DrawLine" />
                <Identify uid="IdentifyTool" tolerance={10} />
                <Reproj uid="ReprojTool" />
                <Print
                  uid="PrintTool"
                  onPrintStart={() => {
                    this.setState({ hide: true });
                    console.log('Start');
                  }}
                  onPrintEnd={(pdf) => {
                    this.setState({ hide: false });
                    console.log('End');
                    pdf && pdf.save('pwet');
                  }}
                />
              </Zone>
            </Zone>
          </Control>
        </Rol>
      </>
    );
  }
}
