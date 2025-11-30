import { TestingModule } from '@nestjs/testing';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import {
  createControllerTestModule,
  getBasicServiceMock,
} from '../common/test-utils/controller-test.utils';

describe('AlbumController', () => {
  let controller: AlbumController;
  let service: AlbumService;

  beforeEach(async () => {
    const mockService = getBasicServiceMock();
    const module: TestingModule = await createControllerTestModule(
      AlbumController,
      AlbumService,
      mockService,
    );

    controller = module.get<AlbumController>(AlbumController);
    service = module.get<AlbumService>(AlbumService);
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
