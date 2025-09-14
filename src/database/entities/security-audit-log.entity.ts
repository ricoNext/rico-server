import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

export enum AuditActionType {
  LOGIN_SUCCESS = "login_success",
  LOGIN_FAILED = "login_failed",
  LOGOUT = "logout",
  PASSWORD_CHANGE = "password_change",
  PROFILE_UPDATE = "profile_update",
  OAUTH_LINK = "oauth_link",
  OAUTH_UNLINK = "oauth_unlink",
  VERIFICATION_CODE_SENT = "verification_code_sent",
  VERIFICATION_CODE_VERIFIED = "verification_code_verified",
  SUSPICIOUS_ACTIVITY = "suspicious_activity",
}

export enum AuditResult {
  SUCCESS = "success",
  FAILURE = "failure",
  WARNING = "warning",
}

@Entity("security_audit_logs")
@Index(["userId", "actionType"])
@Index(["ipAddress"])
@Index(["createdAt"])
export class SecurityAuditLog {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  userId: string;

  @Column({
    type: "enum",
    enum: AuditActionType,
  })
  actionType: AuditActionType;

  @Column({
    type: "enum",
    enum: AuditResult,
  })
  result: AuditResult;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "json", nullable: true })
  metadata: Record<string, unknown>;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  deviceId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  relatedEntityId: string;

  @Column({ nullable: true })
  relatedEntityType: string;
}
