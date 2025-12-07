import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Favorite,
  FavoriteType,
  FavoritesResponse,
} from './entities/favorites.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  async findAll(): Promise<FavoritesResponse> {
    const favorites = await this.favoriteRepository.find();

    const artistIds = favorites
      .filter((f) => f.type === FavoriteType.ARTIST)
      .map((f) => f.entityId);

    const albumIds = favorites
      .filter((f) => f.type === FavoriteType.ALBUM)
      .map((f) => f.entityId);

    const trackIds = favorites
      .filter((f) => f.type === FavoriteType.TRACK)
      .map((f) => f.entityId);

    const artists = await Promise.all(
      artistIds.map(async (id) => {
        try {
          return await this.artistService.findOne(id);
        } catch {
          return null;
        }
      }),
    ).then((results) =>
      results.filter((artist): artist is Artist => artist !== null),
    );

    const albums = await Promise.all(
      albumIds.map(async (id) => {
        try {
          return await this.albumService.findOne(id);
        } catch {
          return null;
        }
      }),
    ).then((results) =>
      results.filter((album): album is Album => album !== null),
    );

    const tracks = await Promise.all(
      trackIds.map(async (id) => {
        try {
          return await this.trackService.findOne(id);
        } catch {
          return null;
        }
      }),
    ).then((results) =>
      results.filter((track): track is Track => track !== null),
    );

    return { artists, albums, tracks };
  }

  async addArtist(id: string): Promise<void> {
    try {
      await this.artistService.findOne(id);
    } catch {
      throw new UnprocessableEntityException("Artist with id doesn't exist.");
    }

    const existing = await this.favoriteRepository.findOne({
      where: { type: FavoriteType.ARTIST, entityId: id },
    });

    if (!existing) {
      const favorite = this.favoriteRepository.create({
        type: FavoriteType.ARTIST,
        entityId: id,
      });
      await this.favoriteRepository.save(favorite);
    }
  }

  async removeArtist(id: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { type: FavoriteType.ARTIST, entityId: id },
    });

    if (!favorite) {
      throw new NotFoundException('Artist was not found.');
    }

    await this.favoriteRepository.remove(favorite);
  }

  async addAlbum(id: string): Promise<void> {
    try {
      await this.albumService.findOne(id);
    } catch {
      throw new UnprocessableEntityException("Album with id doesn't exist.");
    }

    const existing = await this.favoriteRepository.findOne({
      where: { type: FavoriteType.ALBUM, entityId: id },
    });

    if (!existing) {
      const favorite = this.favoriteRepository.create({
        type: FavoriteType.ALBUM,
        entityId: id,
      });
      await this.favoriteRepository.save(favorite);
    }
  }

  async removeAlbum(id: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { type: FavoriteType.ALBUM, entityId: id },
    });

    if (!favorite) {
      throw new NotFoundException('Album was not found.');
    }

    await this.favoriteRepository.remove(favorite);
  }

  async addTrack(id: string): Promise<void> {
    try {
      await this.trackService.findOne(id);
    } catch {
      throw new UnprocessableEntityException("Track with id doesn't exist.");
    }

    const existing = await this.favoriteRepository.findOne({
      where: { type: FavoriteType.TRACK, entityId: id },
    });

    if (!existing) {
      const favorite = this.favoriteRepository.create({
        type: FavoriteType.TRACK,
        entityId: id,
      });
      await this.favoriteRepository.save(favorite);
    }
  }

  async removeTrack(id: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { type: FavoriteType.TRACK, entityId: id },
    });

    if (!favorite) {
      throw new NotFoundException('Track was not found.');
    }

    await this.favoriteRepository.remove(favorite);
  }

  async removeArtistFromFavorites(artistId: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { type: FavoriteType.ARTIST, entityId: artistId },
    });

    if (favorite) {
      await this.favoriteRepository.remove(favorite);
    }
  }

  async removeAlbumFromFavorites(albumId: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { type: FavoriteType.ALBUM, entityId: albumId },
    });

    if (favorite) {
      await this.favoriteRepository.remove(favorite);
    }
  }

  async removeTrackFromFavorites(trackId: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { type: FavoriteType.TRACK, entityId: trackId },
    });

    if (favorite) {
      await this.favoriteRepository.remove(favorite);
    }
  }
}
