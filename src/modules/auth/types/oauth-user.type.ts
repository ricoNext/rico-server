import { GitHubUser } from "./github-user.type";
export type OAuthUserProfile = {
  provider: string;
  providerUserId: string;
  email?: string;
  username: string;
  avatar?: string;
  accessToken?: string;
  profileData: GitHubUser;
};

// GitHub特定的用户信息类型
export type GitHubOAuthProfile = OAuthUserProfile & {
  provider: "github";
  profileData: {
    id: number;
    login: string;
    email?: string;
    name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  };
};

// 通用的OAuth响应类型
export type OAuthResponse = {
  user: {
    id: string;
    email?: string;
    nickname: string;
    avatar?: string;
  };
  accessToken: string;
};
