import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'uuid';

@Injectable()
export class ParseUUIDPipe implements PipeTransform<string, string> {
  constructor(private readonly entityName?: string) {}

  transform(value: string, metadata: ArgumentMetadata): string {
    if (!validate(value)) {
      const paramName = this.entityName
        ? `${this.entityName}Id`
        : metadata.data || 'Parameter';
      throw new BadRequestException(`${paramName} is invalid (not uuid)`);
    }
    return value;
  }
}
