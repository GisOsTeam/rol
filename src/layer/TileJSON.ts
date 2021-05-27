import OlTileJSON from 'ol/source/TileJSON';
import { Options } from 'ol/source/VectorTile';
import { ISnapshotOptions, ISnapshotSource } from '@gisosteam/aol/source/IExtended';
import { LayerType, LayerTypeEnum, SourceType, SourceTypeEnum } from '@gisosteam/aol/source/types';

export interface ITileJSONOptions extends ISnapshotOptions, Options {
    url?: string;
    crossOrigin?: string;
}

export class TileJSON extends OlTileJSON implements ISnapshotSource {
    protected options: ITileJSONOptions;
    
    constructor(options: ITileJSONOptions) {
        super({ crossOrigin: 'anonymous', ...options });
        this.options = { ...options };
        if (this.options.snapshotable != false) {
          this.options.snapshotable = true;
        }
        if (this.options.listable != false) {
          this.options.listable = true;
        }
        if (this.options.removable != false) {
          this.options.removable = true;
        }        
    }

    public getSourceOptions(): ITileJSONOptions {
      return this.options;
    }

    public getLayerType(): LayerType {
      return LayerTypeEnum.Tile;
    }

    public getSourceType(): SourceType {
      return SourceTypeEnum.TileJSON;
    }

    public isSnapshotable(): boolean {
      return this.options.snapshotable;
    }
  
    public isListable(): boolean {
      return this.options.listable;
    }
  
    public isRemovable(): boolean {
      return this.options.removable;
    }

    public setSourceOptions(options: ITileJSONOptions): void {
      this.options = { ...options };
    }
}