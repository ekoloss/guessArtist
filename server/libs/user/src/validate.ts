import * as Joi from 'joi';

import { IGameGetQuestionParams, IUserCreateBody } from '@models';

import { idSchema, ValidatorPipe } from '@app/utils';

export const userValidation = {
  submitResult: {
    body: new ValidatorPipe<IUserCreateBody>(
      Joi.object<IUserCreateBody>({
        name: Joi.string().min(1),
      }),
    ),
    param: new ValidatorPipe<IGameGetQuestionParams>(
      Joi.object<IGameGetQuestionParams>({
        gameId: idSchema().required(),
      }).required(),
    ),
  },
};
