import * as Joi from 'joi';

import { IGameGetQuestionParams, IGameCheckBody } from '@models';

import { idSchema, ValidatorPipe } from '@app/utils';

export const gameValidation = {
  getQuestion: {
    param: new ValidatorPipe<IGameGetQuestionParams>(
      Joi.object<IGameGetQuestionParams>({
        gameId: idSchema().required(),
      }).required(),
    ),
  },
  check: {
    body: new ValidatorPipe<IGameCheckBody>(
      Joi.object<IGameCheckBody>({
        answer: Joi.string().required().min(1),
        albumId: idSchema().required(),
      }).required(),
    ),
    param: new ValidatorPipe<IGameGetQuestionParams>(
      Joi.object<IGameGetQuestionParams>({
        gameId: idSchema().required(),
      }).required(),
    ),
  },
};
