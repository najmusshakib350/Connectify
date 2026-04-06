import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ParseCuidPipe } from '../common/pipes/parse-cuid.pipe';
import { SetPostReactionBodyDto } from './dto/set-post-reaction.dto';
import { PostReactionService } from './post-reaction.service';

type AuthedRequest = Request & {
  user: { userId: string; email: string };
};

@Controller('posts')
export class PostReactionController {
  constructor(private readonly postReactionService: PostReactionService) {}

  @Get(':postId/reactions')
  async getReactionSummary(
    @Param('postId', ParseCuidPipe) postId: string,
    @Req() req: AuthedRequest,
  ) {
    const data = await this.postReactionService.getReactionSummary(
      req.user.userId,
      postId,
    );
    return {
      success: true,
      data,
      message: 'Reaction summary fetched successfully',
    };
  }

  @Put(':postId/reactions')
  async setReaction(
    @Param('postId', ParseCuidPipe) postId: string,
    @Body() dto: SetPostReactionBodyDto,
    @Req() req: AuthedRequest,
  ) {
    const data = await this.postReactionService.setReaction(
      req.user.userId,
      postId,
      dto.reaction,
    );
    return {
      success: true,
      data,
      message: 'Reaction saved successfully',
    };
  }

  @Delete(':postId/reactions')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeReaction(
    @Param('postId', ParseCuidPipe) postId: string,
    @Req() req: AuthedRequest,
  ) {
    await this.postReactionService.removeReaction(req.user.userId, postId);
  }
}
