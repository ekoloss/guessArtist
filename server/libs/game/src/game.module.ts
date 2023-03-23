import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { redisModule, configModule } from '@app/utils';
import { AlbumModule } from '@app/album';
import { ArtistModule } from '@app/artist';

@Module({
  providers: [GameService],
  exports: [GameService],
  imports: [redisModule(), configModule(), AlbumModule, ArtistModule],
})
export class GameModule {}
