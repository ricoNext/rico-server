export type AuthStrategyType = "github" | "password" | "sms" | "google";

export type AuthCredentials = {
  strategy: AuthStrategyType;
  data: unknown;
};

export type AuthResult = {
  user: unknown;
  token?: string;
  refreshToken?: string;
};

export type AuthResponse = {
  success: boolean;
  user?: unknown;
  token?: string;
  error?: string;
  redirectUrl?: string;
};

// 策略基础类型
export type AuthStrategy = {
  readonly type: AuthStrategyType;
  authenticate: (credentials: unknown) => Promise<AuthResult>;
  validateCredentials?: (credentials: unknown) => boolean;
  getAuthUrl?: () => string;
  handleCallback?: (code: string, state?: string) => Promise<AuthResult>;
};

export type StrategyRegistry = Map<AuthStrategyType, AuthStrategy>;

export type StrategyConfig = {
  [key in AuthStrategyType]?: {
    enabled: boolean;
    config: unknown;
  };
};
