import { LayerStyles } from '@gisosteam/aol/LayerStyles';
import { Fill, Stroke, Style, Circle } from 'ol/style';

// const style = new Style({
//     fill: new Fill({
//       color,
//     }),
//     stroke: new Stroke({
//       color,
//       width,
//     }),
//     image: new Circle({
//       radius: width / 2,
//       fill: new Fill({
//         color
//       }),
//       stroke: new Stroke({
//         color,
//         width: width / 2
//       })
//     }),
//     zIndex: Infinity
//   });

export function layerStylesToOlStyle(layerStyles: LayerStyles): Style {
  let stroke = new Stroke();
  let fill = new Fill();
  let image = new Circle();
  let radius = 5;
  // let text = new Text();

  for (const layerStyle of layerStyles) {
    switch (layerStyle.type) {
      case 'circle':
        radius = layerStyle.paint['circle-radius'] as number;
        break;
      case 'fill':
        fill = new Fill({
          color: layerStyle.paint['fill-color'],
        });
        break;
      case 'line':
        stroke = new Stroke({
          color: layerStyle.paint['line-color'],
          width: layerStyle.paint['line-width'] as number,
        });
        break;
      case 'text':
      // const layout = layerStyle.layout;
      // const [ offsetX, offsetY ] = layout["text-offset"] as number[];
      // text = new Text({
      //     fill: new Fill({ color: layout["text-color"] }),
      //     backgroundFill: fill,
      //     font: layout["text-font"] as string,
      //     offsetX,
      //     offsetY,
      //     text: layout["text-field"] as string,
      // });
      // break;
      case 'icon':
      case 'symbol':
        console.warn(`Conversion from ${layerStyle.type} mapBox Type to OlStyle not yet implemented`);
        break;
    }
  }

  image = new Circle({
    radius,
    fill,
    stroke,
  });
  return new Style({ stroke, image, fill });
}
