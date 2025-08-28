import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ITunesService } from './itunes.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SearchController],
  providers: [SearchService, ITunesService],
  exports: [SearchService, ITunesService],
})
export class SearchModule {}
