import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum = this.albumRepository.create({
      name: createAlbumDto.name,
      year: createAlbumDto.year,
      artistId: createAlbumDto.artistId ?? null,
    });

    try {
      return await this.albumRepository.save(newAlbum);
    } catch (error) {
      this.handleForeignKeyError(error);
      throw error;
    }
  }

  async findAll(): Promise<Album[]> {
    return await this.albumRepository.find();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) {
      throw new NotFoundException('Album was not found.');
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.findOne(id);

    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;
    album.artistId = updateAlbumDto.artistId ?? null;

    try {
      return await this.albumRepository.save(album);
    } catch (error) {
      this.handleForeignKeyError(error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const album = await this.findOne(id);

    await this.trackService.nullifyAlbumId(id);
    await this.favoritesService.removeAlbumFromFavorites(id);

    await this.albumRepository.remove(album);
  }

  async nullifyArtistId(artistId: string): Promise<void> {
    await this.albumRepository.update({ artistId }, { artistId: null });
  }

  private handleForeignKeyError(error: unknown): void {
    if (
      error instanceof QueryFailedError &&
      error.message.includes('foreign key constraint')
    ) {
      if (error.message.includes('artistId')) {
        throw new UnprocessableEntityException("Artist with id doesn't exist.");
      }
    }
  }
}
