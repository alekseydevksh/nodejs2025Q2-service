import { Test, TestingModule } from '@nestjs/testing';
import { ArtistService } from './artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';

describe('ArtistService', () => {
  let service: ArtistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtistService,
        {
          provide: AlbumService,
          useValue: {
            nullifyArtistId: jest.fn(),
          },
        },
        {
          provide: TrackService,
          useValue: {
            nullifyArtistId: jest.fn(),
          },
        },
        {
          provide: FavoritesService,
          useValue: {
            removeArtistFromFavorites: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArtistService>(ArtistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an artist', () => {
      const createArtistDto = {
        name: 'Test Artist',
        grammy: false,
      };

      const result = service.create(createArtistDto);

      expect(result.name).toBe(createArtistDto.name);
      expect(result.grammy).toBe(createArtistDto.grammy);
    });
  });

  describe('findAll', () => {
    it('should return an array of artists', () => {
      const result = service.findAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if artist not found', () => {
      expect(() => service.findOne('non-existent-id')).toThrow();
    });
  });
});
