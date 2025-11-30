import { ApiResponseOptions } from '@nestjs/swagger';

export const ApiResponses = {
  Success: (): ApiResponseOptions => ({
    status: 200,
    description: 'Successful operation',
  }),

  Updated: (entityName: string): ApiResponseOptions => ({
    status: 200,
    description: `The ${entityName.toLowerCase()} has been updated.`,
  }),

  Created: (description?: string): ApiResponseOptions => ({
    status: 201,
    description: description || 'Created successfully',
  }),

  Deleted: (description?: string): ApiResponseOptions => ({
    status: 204,
    description: description || 'Deleted successfully',
  }),

  BadRequestInvalidUuid: (entityName: string): ApiResponseOptions => ({
    status: 400,
    description: `Bad request. ${entityName}Id is invalid (not uuid)`,
  }),

  BadRequestMissingFields: (): ApiResponseOptions => ({
    status: 400,
    description: 'Bad request. body does not contain required fields',
  }),

  ForbiddenWrongPassword: (): ApiResponseOptions => ({
    status: 403,
    description: 'oldPassword is wrong',
  }),

  NotFound: (entityName: string): ApiResponseOptions => ({
    status: 404,
    description: `${entityName} was not found.`,
  }),

  NotFoundUser: (): ApiResponseOptions => ({
    status: 404,
    description: 'User not found',
  }),

  UnprocessableEntity: (entityName: string): ApiResponseOptions => ({
    status: 422,
    description: `${entityName} with id doesn't exist.`,
  }),
};
