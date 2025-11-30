import { TestingModule } from '@nestjs/testing';
import { TrackService } from './track.service';
import { FavoritesService } from '../favorites/favorites.service';
import {
  createServiceTestModule,
  testServiceDefinition,
  testFindAllReturnsArray,
  testFindOneThrowsNotFound,
} from '../common/test-utils/service-test.utils';

describe('TrackService', () => {
  let service: TrackService;

  beforeEach(async () => {
    const module: TestingModule = await createServiceTestModule(TrackService, [
      {
        provide: FavoritesService,
        useValue: {
          removeTrackFromFavorites: jest.fn(),
        },
      },
    ]);

    service = module.get<TrackService>(TrackService);
  });

  testServiceDefinition(service);

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
    testFindAllReturnsArray(() => service.findAll(), 'tracks');
  });

  describe('findOne', () => {
    testFindOneThrowsNotFound((id) => service.findOne(id), 'track');
  });
});
