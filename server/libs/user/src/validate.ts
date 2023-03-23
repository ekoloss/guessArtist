import * as Joi from 'joi';

import { IGameGetQuestionParams, IUserCreateBody } from '@models';

import { idSchema, ValidatorPipe } from '@app/utils';

export const userValidation = {
  submitResult: {
    body: new ValidatorPipe<IUserCreateBody>(
      Joi.object<IUserCreateBody>({
        name: Joi.string().min(3),
        score: Joi.number().default(0),
      }),
    ),
    param: new ValidatorPipe<IGameGetQuestionParams>(
      Joi.object<IGameGetQuestionParams>({
        gameId: idSchema().required(),
      }).required(),
    ),
  },
};
