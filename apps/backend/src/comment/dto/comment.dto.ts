import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

const CUID_RE = /^c[a-z0-9]{24}$/i;


export const FEED_PUBLIC_ROOT_CACHE_KEY = 'feed:public:start';

export class CreateCommentBodyDto {
  @IsString()
  @MinLength(1, { message: 'Comment cannot be empty' })
  @MaxLength(8000, { message: 'Comment is too long' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  content!: string;
}

export class CreateReplyBodyDto {
  @IsString()
  @MinLength(1, { message: 'Reply cannot be empty' })
  @MaxLength(8000, { message: 'Reply is too long' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  content!: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined
      ? undefined
      : value,
  )
  @IsString()
  @MinLength(1)
  @Matches(CUID_RE, { message: 'Invalid parent reply id' })
  parentReplyId?: string;
}

export class GetCommentsQueryDto {

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

export class GetRepliesQueryDto {
 
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
  @Max(100)
  limit?: number;
}
