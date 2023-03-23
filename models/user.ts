export interface IUserModel {
  id: string;
  name: string;
  score: number;
}

export interface IUserCreateBody extends Omit<IUserModel, 'id'> {}
export interface IUserUpdateScoreBody extends Omit<IUserModel, 'name'> {
  oldScore: number;
}
export interface IUserGetByName extends Pick<IUserModel, 'name'> {}
export interface IUserResponse extends IUserModel {}
