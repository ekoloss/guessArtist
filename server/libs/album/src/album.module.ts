import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { ArtistModule } from '@app/artist';
import { AlbumController } from '@app/album/album.controller';

@Module({
  providers: [AlbumService],
  exports: [AlbumService],
  imports: [ArtistModule],
  controllers: [AlbumController],
})
export class AlbumModule {}
