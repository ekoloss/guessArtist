export interface IAlbumModel {
  id: string;
  name: string;
  artistId: string;
  showed: number;
  guessed: number;
}

export interface IAlbumModelWithArtist extends IAlbumModel {
  artistName?: string;
}
