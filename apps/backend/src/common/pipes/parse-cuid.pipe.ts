import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';


const PRISMA_CUID = /^c[a-z0-9]{24}$/;

@Injectable()
export class ParseCuidPipe implements PipeTransform<string, string> {
  transform(value: string, _metadata: ArgumentMetadata): string {
    if (typeof value !== 'string' || !PRISMA_CUID.test(value)) {
      throw new BadRequestException('Invalid resource id');
    }
    return value;
  }
}
