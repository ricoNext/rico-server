import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "@/database/entities/user.entity";
import { OAuthProvider, UserOauthProvider } from "@/database/entities/user-oauth-provider.entity";
import { GitHubUser } from "@/modules/auth/types/github-user.type";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserOauthProvider) private readonly oauthProviderRepository: Repository<UserOauthProvider>
  ) {}

  async findOrCreateFromOAuth(oauthData: {
    provider: string;
    providerUserId: string;
    email?: string;
    username: string;
    avatar?: string;
    profileData: GitHubUser;
  }): Promise<User> {
    // 1. 查找是否已存在该OAuth提供者的关联
    const existingOAuth = await this.oauthProviderRepository.findOne({
      where: {
        provider: oauthData.provider as OAuthProvider,
        providerUserId: oauthData.providerUserId,
      },
      relations: ["user"],
    });

    if (existingOAuth) {
      return existingOAuth.user;
    }

    // 2. 查找是否已存在相同邮箱的用户
    let user: User | null = null;
    if (oauthData.email) {
      user = await this.userRepository.findOne({
        where: { email: oauthData.email },
      });
    }

    if (!user) {
      // 3. 创建新用户（如果不存在）
      user = this.userRepository.create({
        email: oauthData.email,
        nickname: oauthData.username,
        avatar: oauthData.avatar,
      });
      user = await this.userRepository.save(user);
    }

    // 4. 创建OAuth关联
    const oauthProvider = this.oauthProviderRepository.create({
      userId: user.id,
      provider: oauthData.provider as OAuthProvider,
      providerUserId: oauthData.providerUserId,
      email: oauthData.email,
      displayName: oauthData.username,
      profileData: oauthData.profileData,
    });

    await this.oauthProviderRepository.save(oauthProvider);

    return user;
  }
}
