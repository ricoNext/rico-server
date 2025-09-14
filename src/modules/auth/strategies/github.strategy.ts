import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github";
import { AuthService } from "../auth.service";
import type { GitHubOAuthProfile } from "../types/oauth-user.type";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService
  ) {
    const clientID = configService.get("GITHUB_CLIENT_ID", "");
    const clientSecret = configService.get("GITHUB_CLIENT_SECRET", "");
    const callbackURL = configService.get("GITHUB_CALLBACK_URL", "");

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ["user:email"],
    });
  }

  async validate(accessToken: string, _refreshToken: string, profile: Strategy.Profile): Promise<unknown> {
    // 处理GitHub用户信息并返回统一格式
    const oauthProfile: GitHubOAuthProfile = {
      provider: "github",
      providerUserId: profile.id,
      email: profile.emails?.[0]?.value,
      username: profile.username || profile.displayName,
      avatar: profile.photos?.[0]?.value,
      profileData: {
        id: profile.id,
        login: profile.username,
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
        avatar_url: profile.photos?.[0]?.value,
      },
      accessToken,
    };

    const user = await this.authService.handleOAuthUser(oauthProfile);
    return user;
  }
}
