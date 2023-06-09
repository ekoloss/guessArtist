import { Controller, Param, Put, Get, Body } from '@nestjs/common';
import { apiPrefix } from '@app/utils';
import { GameService } from '@app/game/game.service';
import { gameValidation } from './validate';
import {
  IGameAlbumResponse,
  IGameCheckBody,
  IGameCheckResponse,
  IGameGetQuestionParams,
} from '@models';

@Controller(`${apiPrefix}/game`)
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':gameId')
  getQuestion(
    @Param(gameValidation.getQuestion.param) param: IGameGetQuestionParams,
  ): Promise<IGameAlbumResponse> {
    return this.gameService.getQuestion(param);
  }

  @Put(':gameId/check')
  check(
    @Param(gameValidation.check.param) param: IGameGetQuestionParams,
    @Body(gameValidation.check.body) body: IGameCheckBody,
  ): Promise<IGameCheckResponse> {
    return this.gameService.checkResult(param, body);
  }
}
