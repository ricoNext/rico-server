import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule, type TypeOrmModuleOptions } from "@nestjs/typeorm";
import { databaseToken } from "../config/database.config";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get(databaseToken) as TypeOrmModuleOptions,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
