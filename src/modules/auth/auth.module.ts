import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "@/modules/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GithubAuthGuard } from "./guards/github-auth.guard";
import { JwtAuthService } from "./jwt.service";
import { GithubStrategy } from "./strategies/github.strategy";

@Module({
  imports: [UserModule, PassportModule.register({ defaultStrategy: "github" })],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthService, GithubStrategy, GithubAuthGuard],
})
export class AuthModule {}
