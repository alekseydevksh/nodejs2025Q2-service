import { TestingModule } from '@nestjs/testing';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import {
  createControllerTestModule,
  getBasicServiceMock,
} from '../common/test-utils/controller-test.utils';

describe('TrackController', () => {
  let controller: TrackController;
  let service: TrackService;

  beforeEach(async () => {
    const mockService = getBasicServiceMock();
    const module: TestingModule = await createControllerTestModule(
      TrackController,
      TrackService,
      mockService,
    );

    controller = module.get<TrackController>(TrackController);
    service = module.get<TrackService>(TrackService);
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
