import { IsEnum } from 'class-validator';
import { PostReactionType } from '../../../generated/prisma/client.js';

export class SetPostReactionBodyDto {
  @IsEnum(PostReactionType, {
    message: 'reaction must be LIKE, HAHA, or LOVE',
  })
  reaction!: PostReactionType;
}
