import { TestingModule } from '@nestjs/testing';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { createControllerTestModule } from '../common/test-utils/controller-test.utils';

describe('FavoritesController', () => {
  let controller: FavoritesController;
  let service: FavoritesService;

  beforeEach(async () => {
    const mockService = {
      findAll: jest.fn(),
      addArtist: jest.fn(),
      removeArtist: jest.fn(),
      addAlbum: jest.fn(),
      removeAlbum: jest.fn(),
      addTrack: jest.fn(),
      removeTrack: jest.fn(),
    };
    const module: TestingModule = await createControllerTestModule(
      FavoritesController,
      FavoritesService,
      mockService,
    );

    controller = module.get<FavoritesController>(FavoritesController);
    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll', () => {
      controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
