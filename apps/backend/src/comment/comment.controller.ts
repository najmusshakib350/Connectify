import {
  Body,
  Controller,
  Get,
  Param,
  Post as PostMethod,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ParseCuidPipe } from '../common/pipes/parse-cuid.pipe';
import { CommentService } from './comment.service';
import {
  CreateCommentBodyDto,
  CreateReplyBodyDto,
  GetCommentsQueryDto,
  GetRepliesQueryDto,
} from './dto/comment.dto';

type AuthedRequest = Request & {
  user: { userId: string; email: string };
};

@Controller('posts')
export class PostCommentController {
  constructor(private readonly commentService: CommentService) {}

  @PostMethod(':postId/comments')
  async createComment(
    @Param('postId', ParseCuidPipe) postId: string,
    @Body() dto: CreateCommentBodyDto,
    @Req() req: AuthedRequest,
  ) {
    const data = await this.commentService.createComment(
      req.user.userId,
      postId,
      dto.content,
    );
    return {
      success: true,
      data,
      message: 'Comment created successfully',
    };
  }

  @Get(':postId/comments')
  async listComments(
    @Param('postId', ParseCuidPipe) postId: string,
    @Query() query: GetCommentsQueryDto,
    @Req() req: AuthedRequest,
  ) {
    const data = await this.commentService.listComments(
      req.user.userId,
      postId,
      query.cursor,
      query.limit,
    );
    return {
      success: true,
      data,
      message: 'Comments fetched successfully',
    };
  }

  @PostMethod(':postId/comments/:commentId/replies')
  async createReply(
    @Param('postId', ParseCuidPipe) postId: string,
    @Param('commentId', ParseCuidPipe) commentId: string,
    @Body() dto: CreateReplyBodyDto,
    @Req() req: AuthedRequest,
  ) {
    const data = await this.commentService.createReply(
      req.user.userId,
      postId,
      commentId,
      dto.content,
      dto.parentReplyId,
    );
    return {
      success: true,
      data,
      message: 'Reply created successfully',
    };
  }

  @Get(':postId/comments/:commentId/replies')
  async listReplies(
    @Param('postId', ParseCuidPipe) postId: string,
    @Param('commentId', ParseCuidPipe) commentId: string,
    @Query() query: GetRepliesQueryDto,
    @Req() req: AuthedRequest,
  ) {
    const data = await this.commentService.listReplies(
      req.user.userId,
      postId,
      commentId,
      query.cursor,
      query.limit,
    );
    return {
      success: true,
      data,
      message: 'Replies fetched successfully',
    };
  }
}
