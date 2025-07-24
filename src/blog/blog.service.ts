import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Tag } from '../tag/entities/tag.entity';
import { BlogTagRelation } from '../blog-tag/entities/blog-tag.entity';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(BlogTagRelation)
    private readonly relationRepository: Repository<BlogTagRelation>,
  ) {}

  findAll(): Promise<Blog[]> {
    return this.blogRepository.find({
      relations: ['tagRelations', 'tagRelations.tag'],
    });
  }

  findOne(id: number): Promise<Blog | null> {
    return this.blogRepository.findOne({
      where: { id },
      relations: ['tagRelations', 'tagRelations.tag'],
    });
  }

  async create(createBlogDto: CreateBlogDto) {
    const { tagIds, ...rest } = createBlogDto;

    const blog = this.blogRepository.create(rest); // 使用Repository创建实体

    // 处理 tags
    if (tagIds && tagIds.length > 0) {
      const tags = await this.tagRepository.findBy({
        id: In(tagIds),
      });

      // 验证标签是否存在
      if (tags.length !== tagIds.length) {
        const invalidIds = tagIds.filter(
          (id) => !tags.some((tag) => tag.id === id),
        );
        throw new NotFoundException(`标签ID不存在: ${invalidIds.join(', ')}`);
      }

      // 直接构建关联关系（无需手动new BlogTagRelation）
      blog.tagRelations = tags.map(
        (tag) => this.relationRepository.create({ tag }), // 自动关联blog
      );
    }

    return this.blogRepository.save(blog);
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException('博客不存在');
    }

    // 处理 tags
    if (updateBlogDto.tagIds && updateBlogDto.tagIds.length > 0) {
      const tags = await this.tagRepository.findBy({
        id: In(updateBlogDto.tagIds),
      });

      // 验证标签是否存在
      if (tags.length !== updateBlogDto?.tagIds?.length) {
        const invalidIds = updateBlogDto?.tagIds?.filter(
          (id) => !tags.some((tag) => tag.id === id),
        );
        throw new NotFoundException(`标签ID不存在: ${invalidIds.join(', ')}`);
      }

      blog.tagRelations = tags.map((tag) =>
        this.relationRepository.create({ tag }),
      );
    }

    return this.blogRepository.save({ ...blog, ...updateBlogDto });
  }

  async remove(id: number) {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException('博客不存在');
    }
    // 删除关联关系
    await this.relationRepository.delete({ blog: { id } });
    // 删除博客
    return this.blogRepository.remove(blog);
  }
}
