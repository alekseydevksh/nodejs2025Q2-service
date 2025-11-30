import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  create(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum = new Album({
      id: randomUUID(),
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId ?? null,
    });

    this.albums.push(newAlbum);
    return newAlbum;
  }

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    const album = this.albums.find((a) => a.id === id);
    if (!album) {
      throw new NotFoundException('Album was not found.');
    }
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const album = this.albums.find((a) => a.id === id);
    if (!album) {
      throw new NotFoundException('Album was not found.');
    }

    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;
    album.artistId = updateAlbumDto.artistId ?? null;

    return album;
  }

  remove(id: string): void {
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException('Album was not found.');
    }
    this.albums.splice(index, 1);

    // Cascade deletion: nullify references and remove from favorites
    this.trackService.nullifyAlbumId(id);
    this.favoritesService.removeAlbumFromFavorites(id);
  }

  nullifyArtistId(artistId: string): void {
    this.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }
}
