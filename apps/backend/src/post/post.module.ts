import { Module } from '@nestjs/common';
import { ReactionModule } from '../reaction/reaction.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [ReactionModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
