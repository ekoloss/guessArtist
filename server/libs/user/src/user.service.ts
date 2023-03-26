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
    { name }: IUserCreateBody,
  ): Promise<IUserResponse> {
    const gameData = await this.redis.get(gameId);
    const gamePayload = JSON.parse(gameData);
    if (!gameData || gamePayload.status !== 'win') {
      throw new NotFoundException();
    }

    const user = await UserOrm.query().findOne({ name });
    if (!user) {
      return UserOrm.query().insertAndFetch({
        name,
        score: winPoints,
      });
    }
    await UserOrm.query().findById(user.id).increment('score', winPoints);
    return user;
  }

  async getTopRated(): Promise<IUserResponse[]> {
    return UserOrm.query().orderBy('score', 'desc').limit(3);
  }

  async exportCSV(
    data: IUserResponse[],
    stream: {
      write: (arg: Record<string, string | number>) => void;
      end: () => void;
    },
  ): Promise<void> {
    data.map((item, index) => {
      stream.write({
        id: index + 1,
        name: item.name,
        score: item.score,
      });
    });
    stream.end();
  }
}
