import { Module } from '@nestjs/common';
import {
  ObjectionModule,
  ObjectionModuleOptions,
} from '@willsoto/nestjs-objection';
import { ConfigService } from '@nestjs/config';

import { ArtistModule } from '@app/artist';
import { UserModule } from '@app/user';
import { AlbumModule } from '@app/album';
import { GameModule } from '@app/game';
import { BaseModel, configModule } from '@app/utils';

@Module({
  imports: [
    ArtistModule,
    UserModule,
    AlbumModule,
    GameModule,
    ObjectionModule.registerAsync({
      imports: [configModule()],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<ObjectionModuleOptions> => ({
        Model: BaseModel,
        config: {
          client: 'pg',
          version: configService.get('pg.version'),
          connection: configService.get('pg'),
        },
      }),
    }),
    configModule(),
  ],
})
export class AppModule {}
