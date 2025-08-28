import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PodcastEntity } from '../../common/entities/podcast.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PodcastEntity])
  ],
  exports: [
    TypeOrmModule
  ]
})
export class DatabaseModule {}
