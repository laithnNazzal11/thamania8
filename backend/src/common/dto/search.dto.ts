import { IsString, IsNotEmpty, IsOptional, IsIn, IsNumber, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SearchQueryDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  term: string;

  @IsOptional()
  @IsIn(['podcast', 'music', 'audiobook', 'shortFilm', 'tvShow', 'software', 'ebook', 'all'])
  media?: string = 'podcast';

  @IsOptional()
  @IsString()
  country?: string = 'US';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(200)
  limit?: number = 50;
}

export class ITunesResponseDto {
  resultCount: number;
  results: ITunesItemDto[];
}

export class ITunesItemDto {
  trackId: number;
  trackName: string;
  artistName: string;
  description?: string;
  primaryGenreName?: string;
  artworkUrl100?: string;
  artworkUrl600?: string;
  trackViewUrl?: string;
  releaseDate?: string;
  country?: string;
  kind?: string;
  trackCount?: number;
}
