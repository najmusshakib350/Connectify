import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export type PostVisibilityInput = 'public' | 'private';

export class CreatePostDto {
  @IsString()
  @MinLength(1, { message: 'Text is required' })
  @MaxLength(50_000, { message: 'Text is too long' })
  text!: string;

  @IsOptional()
  @IsIn(['public', 'private'], {
    message: 'visibility must be public or private',
  })
  visibility?: PostVisibilityInput;
}

export class GetPostsQueryDto {
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === undefined ? undefined : value,
  )
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
