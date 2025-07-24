import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Tag } from '../tag/entities/tag.entity';
import { BlogTagRelation } from '../blog-tag/entities/blog-tag.entity';

import { BlogTagModule } from 'src/blog-tag/blog-tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, Tag, BlogTagRelation]),
    BlogTagModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
