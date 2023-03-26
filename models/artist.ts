export interface IArtistModel {
  id: string;
  name: string;
  itunesId?: string;
}

export interface IArtistGetById extends Pick<IArtistModel, 'id'> {}
