import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';
import { Artist } from '../../artist/entities/artist.entity';
import { Album } from '../../album/entities/album.entity';
import { Track } from '../../track/entities/track.entity';

export enum FavoriteType {
  ARTIST = 'artist',
  ALBUM = 'album',
  TRACK = 'track',
}

@Entity('favorites')
@Unique(['type', 'entityId'])
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: FavoriteType,
  })
  type: FavoriteType;

  @Column({ type: 'uuid' })
  entityId: string;

  constructor(partial: Partial<Favorite>) {
    Object.assign(this, partial);
  }
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
