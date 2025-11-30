import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  create(createTrackDto: CreateTrackDto): Track {
    const newTrack = new Track({
      id: randomUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId ?? null,
      albumId: createTrackDto.albumId ?? null,
      duration: createTrackDto.duration,
    });

    this.tracks.push(newTrack);
    return newTrack;
  }

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    const track = this.tracks.find((t) => t.id === id);
    if (!track) {
      throw new NotFoundException('Track was not found.');
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    const track = this.tracks.find((t) => t.id === id);
    if (!track) {
      throw new NotFoundException('Track was not found.');
    }

    track.name = updateTrackDto.name;
    track.artistId = updateTrackDto.artistId ?? null;
    track.albumId = updateTrackDto.albumId ?? null;
    track.duration = updateTrackDto.duration;

    return track;
  }

  remove(id: string): void {
    const index = this.tracks.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException('Track was not found.');
    }
    this.tracks.splice(index, 1);

    // Cascade deletion: remove from favorites
    this.favoritesService.removeTrackFromFavorites(id);
  }

  nullifyArtistId(artistId: string): void {
    this.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }

  nullifyAlbumId(albumId: string): void {
    this.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }
}
