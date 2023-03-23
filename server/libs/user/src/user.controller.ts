import { Body, Controller, Post, Param, Get } from '@nestjs/common';
import { apiPrefix } from '@app/utils';
import {
  IGameGetQuestionParams,
  IUserCreateBody,
  IUserResponse,
} from '@models';
import { UserService } from '@app/user/user.service';
import { userValidation } from '@app/user/validate';

@Controller(`${apiPrefix}/user`)
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Post(':gameId')
  async submitResult(
    @Param(userValidation.submitResult.param) param: IGameGetQuestionParams,
    @Body(userValidation.submitResult.body) body: IUserCreateBody,
  ): Promise<IUserResponse> {
    return await this.appService.submitResult(param, body);
  }

  @Get('/top')
  async getTopRated(): Promise<IUserResponse[]> {
    return await this.appService.getTopRated();
  }
}
