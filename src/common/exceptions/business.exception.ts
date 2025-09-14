import { HttpException, HttpStatus } from "@nestjs/common";

export type BusinessErrorOptions = {
  code: string;
  message: string;
  details?: string;
  status?: HttpStatus;
};

export class BusinessException extends HttpException {
  constructor(options: BusinessErrorOptions) {
    const { code, message, details, status = HttpStatus.BAD_REQUEST } = options;

    super(
      {
        code,
        message,
        details,
      },
      status
    );
  }
}

// 认证相关错误
export class AuthError {
  static readonly INVALID_CREDENTIALS = new BusinessException({
    code: "AUTH_001",
    message: "用户名或密码错误",
    status: HttpStatus.UNAUTHORIZED,
  });

  static readonly ACCOUNT_LOCKED = new BusinessException({
    code: "AUTH_002",
    message: "账户已被锁定，请稍后再试",
    status: HttpStatus.UNAUTHORIZED,
  });

  static readonly TOKEN_EXPIRED = new BusinessException({
    code: "AUTH_003",
    message: "登录已过期，请重新登录",
    status: HttpStatus.UNAUTHORIZED,
  });

  static readonly INVALID_TOKEN = new BusinessException({
    code: "AUTH_004",
    message: "无效的认证令牌",
    status: HttpStatus.UNAUTHORIZED,
  });

  static readonly OAUTH_ERROR = new BusinessException({
    code: "AUTH_005",
    message: "第三方登录失败",
    status: HttpStatus.BAD_REQUEST,
  });
}

// 用户相关错误
export class UserError {
  static readonly USER_NOT_FOUND = new BusinessException({
    code: "USER_001",
    message: "用户不存在",
    status: HttpStatus.NOT_FOUND,
  });

  static readonly USER_EXISTS = new BusinessException({
    code: "USER_002",
    message: "用户已存在",
    status: HttpStatus.CONFLICT,
  });

  static readonly INVALID_PHONE = new BusinessException({
    code: "USER_003",
    message: "手机号格式不正确",
    status: HttpStatus.BAD_REQUEST,
  });
}

// 验证码相关错误
export class VerificationError {
  static readonly INVALID_CODE = new BusinessException({
    code: "VERIFY_001",
    message: "验证码错误",
    status: HttpStatus.BAD_REQUEST,
  });

  static readonly CODE_EXPIRED = new BusinessException({
    code: "VERIFY_002",
    message: "验证码已过期",
    status: HttpStatus.BAD_REQUEST,
  });

  static readonly SEND_TOO_FREQUENTLY = new BusinessException({
    code: "VERIFY_003",
    message: "发送过于频繁，请稍后再试",
    status: HttpStatus.TOO_MANY_REQUESTS,
  });
}

// 通用错误
export class CommonError {
  static readonly VALIDATION_ERROR = new BusinessException({
    code: "COMMON_001",
    message: "参数验证失败",
    status: HttpStatus.BAD_REQUEST,
  });

  static readonly NOT_FOUND = new BusinessException({
    code: "COMMON_002",
    message: "资源不存在",
    status: HttpStatus.NOT_FOUND,
  });

  static readonly FORBIDDEN = new BusinessException({
    code: "COMMON_003",
    message: "没有访问权限",
    status: HttpStatus.FORBIDDEN,
  });

  static readonly RATE_LIMIT = new BusinessException({
    code: "COMMON_004",
    message: "请求过于频繁，请稍后再试",
    status: HttpStatus.TOO_MANY_REQUESTS,
  });
}
