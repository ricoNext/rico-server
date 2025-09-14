import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Blog } from "./blog.entity";
import { Tag } from "./tag.entity";

@Entity("blog_tag_relation")
export class BlogTagRelation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Blog,
    (blog) => blog.tagRelations,
    { onDelete: "CASCADE" }
  )
  blog: Blog;

  @ManyToOne(
    () => Tag,
    (tag) => tag.blogRelations,
    { onDelete: "CASCADE" }
  )
  tag: Tag;

  @CreateDateColumn()
  createdAt: Date; // 关联创建时间

  @UpdateDateColumn()
  updatedAt: Date; // 关联更新时间
}
