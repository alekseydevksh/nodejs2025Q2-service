import { Test, TestingModule } from '@nestjs/testing';
import { TrackService } from './track.service';
import { FavoritesService } from '../favorites/favorites.service';

describe('TrackService', () => {
  let service: TrackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackService,
        {
          provide: FavoritesService,
          useValue: {
            removeTrackFromFavorites: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TrackService>(TrackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a track', () => {
      const createTrackDto = {
        name: 'Test Track',
        duration: 180,
        artistId: null,
        albumId: null,
      };

      const result = service.create(createTrackDto);

      expect(result.name).toBe(createTrackDto.name);
      expect(result.duration).toBe(createTrackDto.duration);
    });
  });

  describe('findAll', () => {
    it('should return an array of tracks', () => {
      const result = service.findAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if track not found', () => {
      expect(() => service.findOne('non-existent-id')).toThrow();
    });
  });
});
