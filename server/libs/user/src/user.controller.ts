import {
  Body,
  Controller,
  Post,
  Param,
  Get,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { apiPrefix } from '@app/utils';
import type { Response } from 'express';
import {
  IGameGetQuestionParams,
  IUserCreateBody,
  IUserResponse,
} from '@models';
import * as csvWriter from 'csv-write-stream';
import { format } from 'date-fns';
import { UserService } from '@app/user/user.service';
import { userValidation } from '@app/user/validate';

@Controller(`${apiPrefix}/user`)
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Post('/:gameId')
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

  @Get('/top/exportCsv')
  async exportTopCsv(
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const top = await this.getTopRated();
    const stream = csvWriter();

    await this.appService.exportCSV(top, stream);

    const filename = encodeURIComponent(
      `Top users on ${format(new Date(), 'dd.MM.Y')}.csv`,
    );

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    return new StreamableFile(stream);
  }
}
