import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";

@Controller()
export class AppController {
  @Get()
  index(@Req() req: Request) {
    // 获取 cookie
    // 获取所有cookies
    const allCookies = req.cookies;
    // 获取单个cookie

    return `Hello World! token: allCookies.auth_token: ${allCookies.auth_token}`;
  }
}
