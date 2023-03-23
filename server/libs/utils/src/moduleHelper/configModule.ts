import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { DynamicModule } from '@nestjs/common';
import * as Joi from 'joi';

import {
  redisConfig,
  redisValidate,
  pgConfig,
  pgValidate,
} from '../config';

export const configModule = ({
  validationSchema: validation = {},
  load: customLoad = [],
  ...options
}: ConfigModuleOptions = {}): DynamicModule => {
  const validationSchema = {
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    SERVER_PORT: Joi.when('NODE_ENV', {
      is: 'test',
      then: Joi.number().default(4000),
      otherwise: Joi.number().min(0).required(),
    }),
    ...redisValidate,
    ...pgValidate,
    ...validation,
  };

  const load = [redisConfig, pgConfig, ...customLoad];

  return ConfigModule.forRoot({
    load,
    validationSchema: Joi.object(validationSchema),
    ...options,
    cache: true,
  });
};
