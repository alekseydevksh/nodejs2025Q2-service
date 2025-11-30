import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  constructor(
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  create(createArtistDto: CreateArtistDto): Artist {
    const newArtist = new Artist({
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    });

    this.artists.push(newArtist);
    return newArtist;
  }

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    const artist = this.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException('Artist was not found.');
    }
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const artist = this.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException('Artist was not found.');
    }

    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;

    return artist;
  }

  remove(id: string): void {
    const index = this.artists.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException('Artist was not found.');
    }
    this.artists.splice(index, 1);

    // Cascade deletion: nullify references and remove from favorites
    this.albumService.nullifyArtistId(id);
    this.trackService.nullifyArtistId(id);
    this.favoritesService.removeArtistFromFavorites(id);
  }
}
