import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@/database/entities/user.entity";
import { UserOauthProvider } from "@/database/entities/user-oauth-provider.entity";
import { UserService } from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserOauthProvider])],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
