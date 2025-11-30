import { TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  createControllerTestModule,
  getBasicServiceMock,
} from '../common/test-utils/controller-test.utils';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const mockService = getBasicServiceMock();
    const module: TestingModule = await createControllerTestModule(
      UserController,
      UserService,
      mockService,
    );

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
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
