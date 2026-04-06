import type { PostReactionType } from '../../generated/prisma/client.js';

export type PostReactionCountsDto = {
  LIKE: number;
  HAHA: number;
  LOVE: number;
};

export type PostReactionSummaryDto = {
  total: number;
  byType: PostReactionCountsDto;
  myReaction: PostReactionType | null;
};
