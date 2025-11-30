import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';

describe('AlbumService', () => {
  let service: AlbumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumService,
        {
          provide: TrackService,
          useValue: {
            nullifyAlbumId: jest.fn(),
          },
        },
        {
          provide: FavoritesService,
          useValue: {
            removeAlbumFromFavorites: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an album', () => {
      const createAlbumDto = {
        name: 'Test Album',
        year: 2023,
        artistId: null,
      };

      const result = service.create(createAlbumDto);

      expect(result.name).toBe(createAlbumDto.name);
      expect(result.year).toBe(createAlbumDto.year);
    });
  });

  describe('findAll', () => {
    it('should return an array of albums', () => {
      const result = service.findAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if album not found', () => {
      expect(() => service.findOne('non-existent-id')).toThrow();
    });
  });
});
