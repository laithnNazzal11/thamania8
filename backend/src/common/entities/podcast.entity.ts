import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('podcasts')
@Index(['search_term']) // Index for faster search queries
@Index(['artist_name']) // Index for artist searches
@Index(['primary_genre_name']) // Index for genre filtering
export class PodcastEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bigint', unique: true })
  track_id: number;

  @Column({ type: 'varchar', length: 500 })
  track_name: string;

  @Column({ type: 'varchar', length: 300 })
  artist_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  primary_genre_name: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  artwork_url_100: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  artwork_url_600: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  track_view_url: string;

  @Column({ type: 'timestamp', nullable: true })
  release_date: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  kind: string;

  @Column({ type: 'integer', nullable: true })
  track_count: number;

  @Column({ type: 'varchar', length: 200 })
  search_term: string; // Store the search term that found this podcast

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
