import { TestingModule } from '@nestjs/testing';
import { ArtistService } from './artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';
import {
  createServiceTestModule,
  testServiceDefinition,
  testFindAllReturnsArray,
  testFindOneThrowsNotFound,
} from '../common/test-utils/service-test.utils';

describe('ArtistService', () => {
  let service: ArtistService;

  beforeEach(async () => {
    const module: TestingModule = await createServiceTestModule(ArtistService, [
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
    ]);

    service = module.get<ArtistService>(ArtistService);
  });

  testServiceDefinition(service);

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
    testFindAllReturnsArray(() => service.findAll(), 'artists');
  });

  describe('findOne', () => {
    testFindOneThrowsNotFound((id) => service.findOne(id), 'artist');
  });
});
