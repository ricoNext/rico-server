import { Injectable } from "@nestjs/common";
import { User } from "@/database/entities/user.entity";
import { UserService } from "@/modules/user/user.service";
import type { OAuthUserProfile } from "./types/oauth-user.type";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  handleOAuthUser(profile: OAuthUserProfile): Promise<User> {
    const { provider, providerUserId, email, username, avatar, profileData } = profile;

    return this.userService.findOrCreateFromOAuth({
      provider,
      providerUserId,
      email,
      username,
      avatar,
      profileData,
    });
  }
}
