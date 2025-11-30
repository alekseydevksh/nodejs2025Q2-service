import { TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';
import {
  createServiceTestModule,
  testServiceDefinition,
  testFindAllReturnsArray,
  testFindOneThrowsNotFound,
} from '../common/test-utils/service-test.utils';

describe('AlbumService', () => {
  let service: AlbumService;

  beforeEach(async () => {
    const module: TestingModule = await createServiceTestModule(AlbumService, [
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
    ]);

    service = module.get<AlbumService>(AlbumService);
  });

  testServiceDefinition(service);

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
    testFindAllReturnsArray(() => service.findAll(), 'albums');
  });

  describe('findOne', () => {
    testFindOneThrowsNotFound((id) => service.findOne(id), 'album');
  });
});
