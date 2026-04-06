import { Module } from '@nestjs/common';
import { ParseCuidPipe } from '../common/pipes/parse-cuid.pipe';
import { PostCommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [],
  controllers: [PostCommentController],
  providers: [CommentService, ParseCuidPipe],
})
export class CommentModule {}
