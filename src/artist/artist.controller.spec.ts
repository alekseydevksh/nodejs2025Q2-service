import { TestingModule } from '@nestjs/testing';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import {
  createControllerTestModule,
  getBasicServiceMock,
} from '../common/test-utils/controller-test.utils';

describe('ArtistController', () => {
  let controller: ArtistController;
  let service: ArtistService;

  beforeEach(async () => {
    const mockService = getBasicServiceMock();
    const module: TestingModule = await createControllerTestModule(
      ArtistController,
      ArtistService,
      mockService,
    );

    controller = module.get<ArtistController>(ArtistController);
    service = module.get<ArtistService>(ArtistService);
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
