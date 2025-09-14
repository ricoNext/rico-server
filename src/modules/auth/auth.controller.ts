import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { User } from "@/database/entities/user.entity";
import { GithubAuthGuard } from "./guards/github-auth.guard";
import { JwtAuthService } from "./jwt.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly jwtService: JwtAuthService) {}

  @Get("github")
  @UseGuards(GithubAuthGuard)
  githubAuth() {
    // Passport会自动处理重定向
  }

  @Get("github/callback")
  @UseGuards(GithubAuthGuard)
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    try {
      // req.user 包含GitHub策略返回的用户信息
      // 这里req.user应该是GitHub策略validate方法返回的User对象
      const user = req.user as User;

      // 生成JWT token
      const token = await this.jwtService.generateToken({
        userId: user.id,
        email: user.email,
        nickname: user.nickname,
      });

      // 设置HttpOnly cookie
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
      });

      // 重定向到成功页面
      res.redirect("/?auth=success");
    } catch (_) {
      res.redirect("/?error=auth_failed");
    }
  }
}
