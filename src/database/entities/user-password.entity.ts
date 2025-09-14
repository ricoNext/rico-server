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

@Entity("user_passwords")
@Index(["userId", "phone"], { unique: true })
export class UserPassword {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @Column()
  @Index({ unique: true })
  phone: string;

  @Column()
  passwordHash: string;

  @Column()
  salt: string;

  @Column({ default: 0 })
  failedAttempts: number;

  @Column({ nullable: true })
  lastFailedAt: Date;

  @Column({ nullable: true })
  lockedUntil: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => User,
    (user) => user.passwords,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "userId" })
  user: User;
}
