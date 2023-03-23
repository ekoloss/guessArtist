import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IGameGetQuestionParams,
  IUserCreateBody,
  IUserResponse,
} from '@models';
import { UserOrm } from '@app/orm';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { winPoints } from '@app/utils';

@Injectable()
export class UserService {
  private readonly redis: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient();
  }

  async submitResult(
    { gameId }: IGameGetQuestionParams,
    { name, score }: IUserCreateBody,
  ): Promise<IUserResponse> {
    const gameData = await this.redis.get(gameId);
    const gamePayload = JSON.parse(gameData);
    if (!gameData || gamePayload.status !== 'win') {
      throw new NotFoundException();
    }

    const user = UserOrm.query().findOne({ name });
    if (!user) {
      return UserOrm.query().insertAndFetch({
        name,
        score,
      });
    }
    return UserOrm.query().findOne({ name }).increment('score', winPoints);
  }

  async getTopRated(): Promise<IUserResponse[]> {
    return UserOrm.query().orderBy('score', 'desc').limit(3);
  }
}
