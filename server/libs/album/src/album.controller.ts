import { Controller, Get, Res, StreamableFile, Delete } from '@nestjs/common';
import { apiPrefix } from '@app/utils';
import type { Response } from 'express';
import * as csvWriter from 'csv-write-stream';
import { format } from 'date-fns';
import { AlbumService } from '@app/album/album.service';

@Controller(`${apiPrefix}/album`)
export class AlbumController {
  constructor(private readonly service: AlbumService) {}

  @Get('/exportCsv')
  async exportTopCsv(
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const top = await this.service.getAlbumListWithArtists();
    const stream = csvWriter();

    await this.service.exportCSV(top, stream);

    const filename = encodeURIComponent(
      `Album_statistics_${format(new Date(), 'dd.MM.Y')}.csv`,
    );

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    return new StreamableFile(stream);
  }

  @Delete('/resetAlbums')
  async resetAlbums(): Promise<void> {
    await this.service.removeAlbums();
    await this.service.loadAlbums();
  }
}
