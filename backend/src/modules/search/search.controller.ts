import { Controller, Get, Query, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryDto } from '../../common/dto/search.dto';
import { PodcastEntity } from '../../common/entities/podcast.entity';

@Controller('search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name);

  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query() searchQuery: SearchQueryDto): Promise<{
    success: boolean;
    data: PodcastEntity[];
    count: number;
    searchTerm: string;
  }> {
    this.logger.log(`Search request: ${JSON.stringify(searchQuery)}`);

    try {
      // Validate search term
      if (!searchQuery.term || searchQuery.term.trim().length === 0) {
        throw new HttpException(
          {
            message: 'Search term is required',
            details: 'Please provide a valid search term',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (searchQuery.term.trim().length < 2) {
        throw new HttpException(
          {
            message: 'Search term too short',
            details: 'Search term must be at least 2 characters long',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const results = await this.searchService.searchAndStore(searchQuery);

      this.logger.log(`Search completed: ${results.length} results found`);

      return {
        success: true,
        data: results,
        count: results.length,
        searchTerm: searchQuery.term,
      };
    } catch (error) {
      this.logger.error(`Search error: ${error.message}`, error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Search failed',
          details: 'An error occurred while searching. Please try again.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
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
