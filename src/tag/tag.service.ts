import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  create(createTagDto: CreateTagDto) {
    const tag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(tag);
  }

  findAll() {
    return this.tagRepository.find();
  }

  async delete(id: number) {
    // 删除标签时，需要先检查是否有关联关系， 否则不能删除
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['blogRelations'],
    });

    if (tag?.blogRelations?.length) {
      throw new BadRequestException('标签有关联关系，不能删除');
    }

    return this.tagRepository.delete(id);
  }
}
