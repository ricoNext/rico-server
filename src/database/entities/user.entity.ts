import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserOauthProvider } from "./user-oauth-provider.entity";
import { UserPassword } from "./user-password.entity";
import { UserSession } from "./user-session.entity";

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  DELETED = "deleted",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  @Index({ unique: true, where: '"phone" IS NOT NULL' })
  phone: string;

  @Column({ nullable: true })
  @Index({ unique: true, where: '"email" IS NOT NULL' })
  email: string;

  @Column({ default: "" })
  nickname: string;

  @Column({ default: "" })
  avatar: string;

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ default: 0 })
  loginCount: number;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  lastLoginIp: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // 关系定义
  @OneToMany(
    () => UserPassword,
    (password) => password.user
  )
  passwords: UserPassword[];

  @OneToMany(
    () => UserOauthProvider,
    (oauth) => oauth.user
  )
  oauthProviders: UserOauthProvider[];

  @OneToMany(
    () => UserSession,
    (session) => session.user
  )
  sessions: UserSession[];
}
