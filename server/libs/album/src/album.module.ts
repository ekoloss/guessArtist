import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { ArtistModule} from "@app/artist";

@Module({
  providers: [AlbumService],
  exports: [AlbumService],
  imports: [ArtistModule],
})
export class AlbumModule {}
