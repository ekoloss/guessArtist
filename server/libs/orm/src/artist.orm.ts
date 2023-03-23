import { IArtistModel } from '@models';
import { BaseModel } from '@app/utils';

export class ArtistOrm extends BaseModel implements IArtistModel {
  readonly id!: string;
  readonly name!: string;
  readonly itunesId!: string;

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        itunesId: { type: 'string' },
      },
    };
  }

  static tableName = 'artist';

  static column = this.columnsFactory<ArtistColumnType>();
}

export type ArtistColumnType = keyof IArtistModel;
