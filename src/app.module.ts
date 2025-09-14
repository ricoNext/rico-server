import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "modules/auth/auth.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CommonModule } from "./common/common.module";
import { databaseConfig } from "./config/database.config";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === "production" ? [] : [".env.local"],
      isGlobal: true,
      load: [databaseConfig],
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: "7d" },
    }),
    DatabaseModule,
    CommonModule,
    AuthModule,
    UserModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
