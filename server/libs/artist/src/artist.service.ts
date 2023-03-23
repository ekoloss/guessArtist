import { Injectable } from '@nestjs/common';
import { ArtistOrm } from '@app/orm';
import { IArtistModel } from '@models';
import { searchItunes, ItunesEntityMusic } from 'node-itunes-search';
import * as _ from 'lodash';

@Injectable()
export class ArtistService {
  private async getWithoutItunesId(): Promise<IArtistModel[]> {
    return ArtistOrm.query().where({ itunesId: null });
  }

  async prepareArtists(): Promise<void> {
    const artistList = await this.getWithoutItunesId();

    await Promise.all(
      artistList.map(async (item) => {
        const artistData = await searchItunes({
          term: item.name,
          limit: 1,
          entity: ItunesEntityMusic.MusicArtist,
        });

        if (!artistData?.results?.[0]) {
          return;
        }

        await ArtistOrm.query()
          .findById(item.id)
          .update({
            name: artistData.results[0].artistName,
            itunesId: `${artistData.results[0].artistId}`,
          });
      }),
    );
  }

  async getArtistList(): Promise<IArtistModel[]> {
    return ArtistOrm.query().whereNot({ itunesId: null });
  }

  async getRandomArtist(): Promise<IArtistModel> {
    const list = await this.getArtistList();
    return _.sample(list);
  }
}
