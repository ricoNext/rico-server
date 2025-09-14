import { Controller, Get, HttpException, HttpStatus } from "@nestjs/common";
import { AuthError, BusinessException } from "../common/exceptions/business.exception";

@Controller("test")
export class TestController {
  @Get("success")
  testSuccess() {
    return {
      message: "测试成功响应",
      data: {
        id: 1,
        name: "测试数据",
      },
    };
  }

  @Get("http-error")
  testHttpError() {
    throw new HttpException("测试HTTP错误", HttpStatus.BAD_REQUEST);
  }

  @Get("business-error")
  testBusinessError() {
    throw AuthError.INVALID_CREDENTIALS;
  }

  @Get("custom-error")
  testCustomError() {
    throw new BusinessException({
      code: "CUSTOM_001",
      message: "自定义业务错误",
      details: "这是错误的详细信息",
    });
  }
}
