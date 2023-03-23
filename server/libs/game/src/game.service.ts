import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { ArtistService } from '@app/artist';
import { AlbumService } from '@app/album';
import * as _ from 'lodash';
import {
  IGameAlbumResponse,
  IGameCheckBody,
  IGameCheckResponse,
  IGameGetQuestionParams,
} from '@models';
import { gameStatus } from '@app/utils';

@Injectable()
export class GameService {
  private readonly redis: Redis;

  constructor(
    private readonly redisService: RedisService,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
  ) {
    this.redis = this.redisService.getClient();
  }

  async getQuestion({
    gameId,
  }: IGameGetQuestionParams): Promise<IGameAlbumResponse> {
    let game = await this.redis.get(gameId);

    if (!game) {
      const randomArtist = await this.artistService.getRandomArtist();
      const albums = await this.albumService.getAlbumsByArtist({
        id: randomArtist.id,
      });

      const payload = JSON.stringify({
        artistName: randomArtist.name,
        albums: _.shuffle(albums),
        status: gameStatus.in_progress,
      });
      await this.redis.set(gameId, payload);
      game = payload;
    }

    const parsedPayload = JSON.parse(game);
    if (parsedPayload.status !== gameStatus.in_progress) {
      throw new NotFoundException();
    }
    const nextAlbum = parsedPayload.albums.pop();
    await this.redis.set(gameId, JSON.stringify(parsedPayload));
    await this.albumService.updateStatistic({
      id: nextAlbum.id,
      column: 'showed',
    });

    return {
      album: nextAlbum.name,
    };
  }

  async checkResult(
    { gameId }: IGameGetQuestionParams,
    { answer, albumId }: IGameCheckBody,
  ): Promise<IGameCheckResponse> {
    const game = await this.redis.get(gameId);
    const parsedPayload = JSON.parse(game);

    if (answer && parsedPayload.artistName === answer.trim()) {
      await this.redis.set(
        gameId,
        JSON.stringify({
          ...parsedPayload,
          status: gameStatus.win,
        }),
      );

      await this.albumService.updateStatistic({
        id: albumId,
        column: 'guessed',
      });

      return {
        correct: true,
        status: gameStatus.win,
      };
    }

    if (!parsedPayload.albums.length) {
      await this.redis.set(
        gameId,
        JSON.stringify({
          ...parsedPayload,
          status: gameStatus.loose,
        }),
      );

      return {
        correct: false,
        status: gameStatus.loose,
      };
    }

    return {
      correct: false,
      status: gameStatus.in_progress,
    };
  }
}
