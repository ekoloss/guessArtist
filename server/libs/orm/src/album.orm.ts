import { IAlbumModel } from '@models';
import { BaseModel } from '@app/utils';

export class AlbumOrm extends BaseModel implements IAlbumModel {
  readonly id!: string;
  readonly name!: string;
  readonly artistId!: string;
  readonly showed!: number;
  readonly guessed!: number;

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        artistId: { type: 'string' },
        showed: { type: 'number' },
        guessed: { type: 'number' },
      },
    };
  }

  static tableName = 'album';

  static column = this.columnsFactory<AlbumColumnType>();
}

export type AlbumColumnType = keyof IAlbumModel;
