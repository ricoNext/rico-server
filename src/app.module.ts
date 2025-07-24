import { Module } from '@nestjs/common';
import { BlogModule } from './blog/blog.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { databaseConfig } from './config/database.config';
import { TagModule } from './tag/tag.module';
import { BlogTagModule } from './blog-tag/blog-tag.module';

@Module({
  imports: [
    BlogModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    DatabaseModule,
    TagModule,
    BlogTagModule,
  ],
})
export class AppModule {}
