import { Test } from '@nestjs/testing';

export function createControllerTestModule<TController, TService>(
  ControllerClass: new (...args: any[]) => TController,
  ServiceClass: new (...args: any[]) => TService,
  mockServiceMethods: Record<string, jest.Mock>,
) {
  return Test.createTestingModule({
    controllers: [ControllerClass],
    providers: [
      {
        provide: ServiceClass,
        useValue: mockServiceMethods,
      },
    ],
  }).compile();
}

export function getBasicServiceMock() {
  return {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
}
