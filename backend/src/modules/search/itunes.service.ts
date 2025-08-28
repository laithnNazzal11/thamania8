import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { SearchQueryDto, ITunesResponseDto } from '../../common/dto/search.dto';

@Injectable()
export class ITunesService {
  private readonly logger = new Logger(ITunesService.name);
  private readonly baseUrl = 'https://itunes.apple.com/search';

  async searchItunes(searchQuery: SearchQueryDto): Promise<ITunesResponseDto> {
    try {
      this.logger.log(`Searching iTunes for: "${searchQuery.term}"`);

      const params = {
        term: searchQuery.term,
        media: searchQuery.media || 'podcast',
        country: searchQuery.country || 'US',
        limit: searchQuery.limit || 50,
        explicit: 'Yes', // Include explicit content
      };

      const response: AxiosResponse<ITunesResponseDto> = await axios.get(this.baseUrl, {
        params,
        timeout: 10000, // 10 second timeout
        headers: {
          'User-Agent': 'iTunes-Search-App/1.0',
        },
      });

      this.logger.log(`iTunes API returned ${response.data.resultCount} results`);

      // Validate response structure
      if (!response.data || typeof response.data.resultCount !== 'number') {
        throw new HttpException(
          'Invalid response from iTunes API',
          HttpStatus.BAD_GATEWAY
        );
      }

      return response.data;
    } catch (error) {
      this.logger.error(`iTunes API error: ${error.message}`, error.stack);

      if (error.code === 'ECONNABORTED') {
        throw new HttpException(
          'iTunes API request timeout',
          HttpStatus.REQUEST_TIMEOUT
        );
      }

      if (error.response?.status) {
        throw new HttpException(
          `iTunes API error: ${error.response.status}`,
          HttpStatus.BAD_GATEWAY
        );
      }

      throw new HttpException(
        'Failed to search iTunes API',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Format iTunes date string to Date object
   */
  formatReleaseDate(dateString?: string): Date | null {
    if (!dateString) return null;
    
    try {
      return new Date(dateString);
    } catch {
      return null;
    }
  }

  /**
   * Clean and validate iTunes data
   */
  cleanITunesData(item: any): any {
    return {
      trackId: item.trackId || item.collectionId,
      trackName: item.trackName || item.collectionName || 'Unknown Title',
      artistName: item.artistName || 'Unknown Artist',
      description: item.description || item.longDescription || null,
      primaryGenreName: item.primaryGenreName || null,
      artworkUrl100: item.artworkUrl100 || null,
      artworkUrl600: item.artworkUrl600 || null,
      trackViewUrl: item.trackViewUrl || item.collectionViewUrl || null,
      releaseDate: this.formatReleaseDate(item.releaseDate),
      country: item.country || null,
      kind: item.kind || item.wrapperType || null,
      trackCount: item.trackCount || null,
    };
  }
}
