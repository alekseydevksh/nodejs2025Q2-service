import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Favorites, FavoritesResponse } from './entities/favorites.entity';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class FavoritesService {
  private readonly favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  findAll(): FavoritesResponse {
    const artists = this.favorites.artists
      .map((id) => {
        try {
          return this.artistService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter(
        (artist): artist is NonNullable<typeof artist> => artist !== null,
      );

    const albums = this.favorites.albums
      .map((id) => {
        try {
          return this.albumService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter((album): album is NonNullable<typeof album> => album !== null);

    const tracks = this.favorites.tracks
      .map((id) => {
        try {
          return this.trackService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter((track): track is NonNullable<typeof track> => track !== null);

    return { artists, albums, tracks };
  }

  addArtist(id: string): void {
    try {
      this.artistService.findOne(id);
    } catch {
      throw new UnprocessableEntityException("Artist with id doesn't exist.");
    }

    if (!this.favorites.artists.includes(id)) {
      this.favorites.artists.push(id);
    }
  }

  removeArtist(id: string): void {
    const index = this.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Artist was not found.');
    }
    this.favorites.artists.splice(index, 1);
  }

  addAlbum(id: string): void {
    try {
      this.albumService.findOne(id);
    } catch {
      throw new UnprocessableEntityException("Album with id doesn't exist.");
    }

    if (!this.favorites.albums.includes(id)) {
      this.favorites.albums.push(id);
    }
  }

  removeAlbum(id: string): void {
    const index = this.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Album was not found.');
    }
    this.favorites.albums.splice(index, 1);
  }

  addTrack(id: string): void {
    try {
      this.trackService.findOne(id);
    } catch {
      throw new UnprocessableEntityException("Track with id doesn't exist.");
    }

    if (!this.favorites.tracks.includes(id)) {
      this.favorites.tracks.push(id);
    }
  }

  removeTrack(id: string): void {
    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Track was not found.');
    }
    this.favorites.tracks.splice(index, 1);
  }

  removeArtistFromFavorites(artistId: string): void {
    const index = this.favorites.artists.indexOf(artistId);
    if (index !== -1) {
      this.favorites.artists.splice(index, 1);
    }
  }

  removeAlbumFromFavorites(albumId: string): void {
    const index = this.favorites.albums.indexOf(albumId);
    if (index !== -1) {
      this.favorites.albums.splice(index, 1);
    }
  }

  removeTrackFromFavorites(trackId: string): void {
    const index = this.favorites.tracks.indexOf(trackId);
    if (index !== -1) {
      this.favorites.tracks.splice(index, 1);
    }
  }
}
