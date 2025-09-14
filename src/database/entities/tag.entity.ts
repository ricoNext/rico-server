import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BlogTagRelation } from "./blog-tag.entity";

@Entity("tag")
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 255,
    comment: "标签名称",
  })
  name: string;

  @Column({
    type: "varchar",
    length: 155,
    nullable: true,
    comment: "标签描述",
  })
  description?: string;

  @CreateDateColumn({
    comment: "创建时间",
  })
  createdAt: Date;

  @UpdateDateColumn({
    comment: "更新时间",
  })
  updatedAt: Date;

  @OneToMany(
    () => BlogTagRelation,
    (relation) => relation.tag
  )
  blogRelations: BlogTagRelation[]; // 关联关系集合
}
