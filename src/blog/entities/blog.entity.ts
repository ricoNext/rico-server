import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { BlogTagRelation } from '../../blog-tag/entities/blog-tag.entity';

@Entity('blog')
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 200,
    comment: '博客标题',
  })
  title: string;

  @Column({
    type: 'text',
    comment: '博客内容',
  })
  content: string;

  @Column({
    type: 'varchar',
    length: 155,
    nullable: true,
    comment: '博客描述',
  })
  description?: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updatedAt: Date;

  @OneToMany(() => BlogTagRelation, (relation) => relation.blog, {
    cascade: true,
  })
  tagRelations?: BlogTagRelation[]; // 关联关系集合
}
