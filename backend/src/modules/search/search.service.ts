import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PodcastEntity } from '../../common/entities/podcast.entity';
import { ITunesService } from './itunes.service';
import { SearchQueryDto } from '../../common/dto/search.dto';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    @InjectRepository(PodcastEntity)
    private readonly podcastRepository: Repository<PodcastEntity>,
    private readonly itunesService: ITunesService,
  ) {}

  async searchAndStore(searchQuery: SearchQueryDto): Promise<PodcastEntity[]> {
    this.logger.log(`Starting search for: "${searchQuery.term}"`);

    // 1. Search iTunes API
    const itunesResponse = await this.itunesService.searchItunes(searchQuery);

    if (itunesResponse.resultCount === 0) {
      this.logger.log('No results found from iTunes API');
      return [];
    }

    // 2. Process and store results
    const savedPodcasts: PodcastEntity[] = [];

    for (const item of itunesResponse.results) {
      try {
        // Clean the iTunes data
        const cleanedData = this.itunesService.cleanITunesData(item);

        // Check if podcast already exists
        const existingPodcast = await this.podcastRepository.findOne({
          where: { track_id: cleanedData.trackId }
        });

        if (existingPodcast) {
          // Update search term if not already associated
          if (!existingPodcast.search_term.includes(searchQuery.term.toLowerCase())) {
            existingPodcast.search_term = `${existingPodcast.search_term}, ${searchQuery.term.toLowerCase()}`;
            await this.podcastRepository.save(existingPodcast);
          }
          savedPodcasts.push(existingPodcast);
          continue;
        }

        // Create new podcast entity
        const podcast = this.podcastRepository.create({
          track_id: cleanedData.trackId,
          track_name: cleanedData.trackName,
          artist_name: cleanedData.artistName,
          description: cleanedData.description,
          primary_genre_name: cleanedData.primaryGenreName,
          artwork_url_100: cleanedData.artworkUrl100,
          artwork_url_600: cleanedData.artworkUrl600,
          track_view_url: cleanedData.trackViewUrl,
          release_date: cleanedData.releaseDate,
          country: cleanedData.country,
          kind: cleanedData.kind,
          track_count: cleanedData.trackCount,
          search_term: searchQuery.term.toLowerCase(),
        });

        // Save to database
        const savedPodcast = await this.podcastRepository.save(podcast);
        savedPodcasts.push(savedPodcast);

        this.logger.log(`Saved podcast: ${savedPodcast.track_name} by ${savedPodcast.artist_name}`);
      } catch (error) {
        this.logger.error(`Failed to save podcast ${item.trackId}: ${error.message}`);
        // Continue with other items even if one fails
      }
    }

    this.logger.log(`Successfully processed ${savedPodcasts.length} podcasts`);
    return savedPodcasts;
  }

  async getStoredResults(searchTerm?: string): Promise<PodcastEntity[]> {
    if (searchTerm) {
      return this.podcastRepository
        .createQueryBuilder('podcast')
        .where('podcast.search_term ILIKE :term', { term: `%${searchTerm.toLowerCase()}%` })
        .orderBy('podcast.created_at', 'DESC')
        .getMany();
    }

    return this.podcastRepository.find({
      order: { created_at: 'DESC' },
      take: 100, // Limit to latest 100 results
    });
  }

  async getPodcastById(id: string): Promise<PodcastEntity | null> {
    return this.podcastRepository.findOne({ where: { id } });
  }

  async getPopularSearchTerms(): Promise<{ search_term: string; count: number }[]> {
    const results = await this.podcastRepository
      .createQueryBuilder('podcast')
      .select('podcast.search_term', 'search_term')
      .addSelect('COUNT(*)', 'count')
      .groupBy('podcast.search_term')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return results;
  }
}
