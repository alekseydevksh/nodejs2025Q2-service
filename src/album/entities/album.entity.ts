import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Artist } from '../../artist/entities/artist.entity';
import { Track } from '../../track/entities/track.entity';

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'int' })
  year: number;

  @ManyToOne(() => Artist, (artist) => artist.albums, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @Column({ type: 'uuid', nullable: true, default: null })
  artistId: string | null;

  @OneToMany(() => Track, (track) => track.album, { cascade: false })
  tracks: Track[];

  constructor(partial: Partial<Album>) {
    Object.assign(this, partial);
  }
}
