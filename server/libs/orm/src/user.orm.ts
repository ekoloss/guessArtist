import { IUserModel } from '@models';
import { BaseModel } from '@app/utils';

export class UserOrm extends BaseModel implements IUserModel {
  readonly id!: string;
  readonly name!: string;
  readonly score!: number;

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        score: { type: 'number' },
      },
    };
  }

  static tableName = 'user';

  static column = this.columnsFactory<UserColumnType>();
}

export type UserColumnType = keyof IUserModel;
