import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: ArtistService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: AlbumService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: TrackService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return favorites response', () => {
      const result = service.findAll();
      expect(result).toHaveProperty('artists');
      expect(result).toHaveProperty('albums');
      expect(result).toHaveProperty('tracks');
    });
  });
});
