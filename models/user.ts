export interface IUserModel {
  id: string;
  name: string;
}

export interface IUserCreateBody extends Omit<IUserModel, 'id'> {}
export interface IUserResponse extends IUserModel {
  score: number;
}
