import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Album } from '../../album/entities/album.entity';
import { Track } from '../../track/entities/track.entity';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'boolean' })
  grammy: boolean;

  @OneToMany(() => Album, (album) => album.artist, { cascade: false })
  albums: Album[];

  @OneToMany(() => Track, (track) => track.artist, { cascade: false })
  tracks: Track[];

  constructor(partial: Partial<Artist>) {
    Object.assign(this, partial);
  }
}
