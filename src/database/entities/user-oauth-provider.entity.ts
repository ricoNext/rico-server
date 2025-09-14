import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

export enum OAuthProvider {
  GITHUB = "github",
  GOOGLE = "google",
  WECHAT = "wechat",
  APPLE = "apple",
}

@Entity("user_oauth_providers")
@Index(["provider", "providerUserId"], { unique: true })
@Index(["userId", "provider"], { unique: true })
export class UserOauthProvider {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column({
    type: "enum",
    enum: OAuthProvider,
  })
  provider: OAuthProvider;

  @Column()
  providerUserId: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ type: "json", nullable: true })
  profileData: unknown;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => User,
    (user) => user.oauthProviders,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "userId" })
  user: User;
}
