export interface IArtistModel {
  id: string;
  name: string;
  itunesId?: string;
}

export interface IArtistCreateBody extends Omit<IArtistModel, 'id'> {}
export interface IArtistUpdateBody extends Omit<IArtistModel, 'name'> {}
export interface IArtistGetById extends Pick<IArtistModel, 'id'> {}
