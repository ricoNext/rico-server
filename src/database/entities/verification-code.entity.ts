import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

export enum VerificationCodeType {
  LOGIN = "login",
  REGISTER = "register",
  RESET_PASSWORD = "reset_password",
  BIND_PHONE = "bind_phone",
}

export enum VerificationCodeStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  EXPIRED = "expired",
  USED = "used",
}

@Entity("verification_codes")
@Index(["phone", "type", "status"])
@Index(["code"], { unique: true })
export class VerificationCode {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  phone: string;

  @Column()
  code: string;

  @Column({
    type: "enum",
    enum: VerificationCodeType,
  })
  type: VerificationCodeType;

  @Column({
    type: "enum",
    enum: VerificationCodeStatus,
    default: VerificationCodeStatus.PENDING,
  })
  status: VerificationCodeStatus;

  @Column({ default: 0 })
  attemptCount: number;

  @Column()
  expiresAt: Date;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;
}
