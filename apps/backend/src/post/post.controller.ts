import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post as PostMethod,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename, join } from 'node:path';
import { mkdirSync } from 'node:fs';
import type { Request } from 'express';
import { CreatePostDto, GetPostsQueryDto } from './dto/create-post.dto';
import { PostService } from './post.service';

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'posts');
const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024;

type AuthedRequest = Request & {
  user: { userId: string; email: string };
};

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @PostMethod()
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          mkdirSync(UPLOAD_DIR, { recursive: true });
          cb(null, UPLOAD_DIR);
        },
        filename: (_req, file, cb) => {
          const safe = basename(file.originalname);
          const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
          cb(null, `${unique}-${safe}`);
        },
      }),
      limits: { fileSize: MAX_BYTES },
      fileFilter: (_req, file, cb) => {
        if (file.fieldname !== 'image') {
          cb(
            new BadRequestException(
              'Only multipart field "image" may contain a file (omit files for text-only posts). Do not use "images" or other file fields.',
            ),
            false,
          );
          return;
        }
        if (!ALLOWED_MIMES.has(file.mimetype)) {
          cb(
            new BadRequestException(
              'Only image/jpeg, image/png, and image/webp are allowed',
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body() dto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[] | undefined,
    @Req() req: AuthedRequest,
  ) {
    const list = files ?? [];
    const imageFiles = list.filter((f) => f.fieldname === 'image');
    if (imageFiles.length > 1) {
      throw new BadRequestException(
        'Only one image file is allowed per post',
      );
    }
    const file = imageFiles[0];
    const imageRelPath = file
      ? `/uploads/posts/${file.filename}`
      : null;
    const data = await this.postService.create(req.user.userId, dto, imageRelPath);
    return {
      success: true,
      data,
      message: 'Post created successfully',
    };
  }

  @Get()
  async findAll(@Query() query: GetPostsQueryDto, @Req() req: AuthedRequest) {
    const data = await this.postService.findAll(
      req.user.userId,
      query.cursor,
      query.limit,
    );
    return {
      success: true,
      data,
      message: 'Posts fetched successfully',
    };
  }
}
