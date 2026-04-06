import { Module } from '@nestjs/common';
import { ParseCuidPipe } from '../common/pipes/parse-cuid.pipe';
import { PostReactionController } from './post-reaction.controller';
import { PostReactionService } from './post-reaction.service';

@Module({
  imports: [],
  controllers: [PostReactionController],
  providers: [PostReactionService, ParseCuidPipe],
  exports: [PostReactionService],
})
export class ReactionModule {}
