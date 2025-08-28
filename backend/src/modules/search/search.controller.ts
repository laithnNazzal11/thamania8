import { Controller, Get, Query, HttpStatus, HttpException } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryDto } from '../../common/dto/search.dto';
import { PodcastEntity } from '../../common/entities/podcast.entity';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query() searchQuery: SearchQueryDto): Promise<{
    success: boolean;
    data: PodcastEntity[];
    count: number;
    searchTerm: string;
  }> {
    try {
      if (!searchQuery.term || searchQuery.term.trim().length === 0) {
        throw new HttpException(
          'Search term is required',
          HttpStatus.BAD_REQUEST
        );
      }

      const results = await this.searchService.searchAndStore(searchQuery);

      return {
        success: true,
        data: results,
        count: results.length,
        searchTerm: searchQuery.term,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Internal server error during search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('history')
  async getSearchHistory(@Query('term') term?: string): Promise<{
    success: boolean;
    data: PodcastEntity[];
    count: number;
  }> {
    try {
      const results = await this.searchService.getStoredResults(term);

      return {
        success: true,
        data: results,
        count: results.length,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch search history',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('popular-terms')
  async getPopularSearchTerms(): Promise<{
    success: boolean;
    data: { search_term: string; count: number }[];
  }> {
    try {
      const results = await this.searchService.getPopularSearchTerms();

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch popular search terms',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
