import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'uuid';

@Injectable()
export class ParseUUIDPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!validate(value)) {
      throw new BadRequestException(
        `${metadata.data || 'Parameter'} is invalid (not uuid)`,
      );
    }
    return value;
  }
}
