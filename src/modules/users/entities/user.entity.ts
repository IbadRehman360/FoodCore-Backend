import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';
import { Role, AccountStatus, Gender } from '@common/enums';

@Entity('users')
export class User extends BaseEntity {
  // ─── Core identity ───────────────────────────────────────────────────────
  @Column() fullName: string;
  @Column({ unique: true, nullable: true }) username: string;
  @Column({ unique: true }) email: string;
  @Column({ select: false, nullable: true }) password: string;
  @Column({ nullable: true }) phone: string;
  @Column({ type: 'enum', enum: Gender, nullable: true }) gender: Gender;
  @Column({ nullable: true }) age: number;
  @Column({ type: 'date', nullable: true }) dateOfBirth: Date;

  // ─── Roles & status ───────────────────────────────────────────────────────
  @Column({ type: 'enum', enum: Role, default: Role.USER }) role: Role;
  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.PENDING }) status: AccountStatus;

  // ─── Auth / OTP / tokens ──────────────────────────────────────────────────
  @Column({ nullable: true }) otp: string;
  @Column({ type: 'timestamp', nullable: true }) otpExpiry: Date;
  @Column({ nullable: true, select: false }) refreshToken: string;
  @Column({ nullable: true }) provider: string;

  // ─── MFA ─────────────────────────────────────────────────────────────────
  @Column({ default: false }) isMfaEnabled: boolean;
  @Column({ nullable: true, select: false }) mfaSecret: string;

  // ─── Profile setup (screen 6) ─────────────────────────────────────────────
  @Column({ nullable: true }) profilePhoto: string;
  @Column({ nullable: true }) country: string;
  @Column({ nullable: true }) city: string;
  @Column({ nullable: true }) state: string;
  @Column({ type: 'text', nullable: true }) about: string;

  // ─── Health profile (screen 7) ────────────────────────────────────────────
  @Column({ type: 'text', nullable: true }) healthGoals: string;
  @Column({ type: 'float', nullable: true }) weight: number;
  @Column({ type: 'float', nullable: true }) height: number;
  @Column({ type: 'text', array: true, nullable: true, default: [] }) symptoms: string[];
  @Column({ type: 'text', array: true, nullable: true, default: [] }) foodAllergies: string[];
  @Column({ nullable: true }) mealPersonalization: string;

  // ─── Referral (screen 8) ──────────────────────────────────────────────────
  @Column({ unique: true, nullable: true }) referralCode: string;
  @Column({ nullable: true }) referredBy: string;

  // ─── Onboarding flags ─────────────────────────────────────────────────────
  @Column({ default: false }) isProfileComplete: boolean;
  @Column({ default: false }) isHealthProfileComplete: boolean;
}
