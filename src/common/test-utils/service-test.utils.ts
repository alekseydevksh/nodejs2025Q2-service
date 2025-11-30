import { Test } from '@nestjs/testing';

export function createServiceTestModule<TService>(
  ServiceClass: new (...args: any[]) => TService,
  mockDependencies: Array<{
    provide: any;
    useValue: Record<string, jest.Mock>;
  }>,
) {
  return Test.createTestingModule({
    providers: [ServiceClass, ...mockDependencies],
  }).compile();
}

export function testServiceDefinition<TService>(service: TService) {
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
}

export function testFindAllReturnsArray<T>(
  findAllFn: () => T[],
  entityName: string,
) {
  it(`should return an array of ${entityName}`, () => {
    const result = findAllFn();
    expect(Array.isArray(result)).toBe(true);
  });
}

export function testFindOneThrowsNotFound(
  findOneFn: (id: string) => void,
  entityName: string,
) {
  it(`should throw NotFoundException if ${entityName} not found`, () => {
    expect(() => findOneFn('non-existent-id')).toThrow();
  });
}
