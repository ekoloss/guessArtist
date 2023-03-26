import { Injectable } from '@nestjs/common';
import { ArtistService } from '@app/artist';
import {
  lookupItunes,
  ItunesLookupType,
  ItunesEntityMusic,
} from 'node-itunes-search';
import * as _ from 'lodash';
import { AlbumOrm } from '@app/orm';
import { IAlbumModel, IArtistGetById, IAlbumModelWithArtist } from '@models';

interface IAlbumUpdateStatistics {
  id: string;
  column: 'showed' | 'guessed';
}

@Injectable()
export class AlbumService {
  constructor(private readonly artistService: ArtistService) {}

  async loadAlbums(): Promise<void> {
    const albumPersist = await AlbumOrm.query().whereNot({ name: null });
    if (albumPersist.length > 0) {
      return;
    }
    const artistList = await this.artistService.getArtistList();

    await Promise.all(
      artistList.map(async (artist) => {
        const albumList = await lookupItunes({
          keys: [artist.itunesId],
          limit: undefined,
          keyType: ItunesLookupType.ID,
          entity: ItunesEntityMusic.Album,
        });
        if (!albumList?.results) {
          return;
        }
        const randomAlbums = _.sampleSize(
          albumList?.results.filter((item) => item.collectionName),
          5,
        ).map((data) => ({
          name: data.collectionName,
          artistId: artist.id,
        }));

        if (randomAlbums.length > 0) {
          await AlbumOrm.query().insert(randomAlbums);
        }
      }),
    );
  }

  async getAlbumsByArtist({ id }: IArtistGetById): Promise<IAlbumModel[]> {
    return AlbumOrm.query().where({
      artistId: id,
    });
  }

  async updateStatistic({ id, column }: IAlbumUpdateStatistics): Promise<void> {
    await AlbumOrm.query().findById(id).increment(column, 1);
  }

  async getAlbumListWithArtists(): Promise<IAlbumModelWithArtist[]> {
    return AlbumOrm.query()
      .join('artist', `artist.id`, '=', 'album.artistId')
      .orderBy('showed', 'desc')
      .select(
        'album.id',
        'album.name',
        'album.showed',
        'album.guessed',
        'album.artistId',
        'artist.name as artistName',
      );
  }

  async exportCSV(
    albums: IAlbumModelWithArtist[],
    stream: {
      write: (arg: Record<string, string | number>) => void;
      end: () => void;
    },
  ): Promise<void> {
    albums.map((item, index) => {
      stream.write({
        id: index + 1,
        albumName: item.name,
        artistName: item.artistName,
        showed: item.showed,
        guessed: item.guessed,
      });
    });
    stream.end();
  }

  async removeAlbums(): Promise<void> {
    await AlbumOrm.query().whereNot('id', null).delete();
  }
}
