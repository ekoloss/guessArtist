import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { logger } from '@app/logger';
import { AppModule } from './app.module';
import { ArtistService } from '@app/artist';
import { AlbumService } from '@app/album';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const artistService = app.get(ArtistService);
  const albumService = app.get(AlbumService);

  //@TODO load data on start dont works correctly
  await artistService.prepareArtists();
  await albumService.loadAlbums();
  app.enableCors();
  app.useLogger(logger);
  await app.listen(configService.get('SERVER_PORT'));
}
bootstrap();
