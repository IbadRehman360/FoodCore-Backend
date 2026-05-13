import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@database/postgres/base.entity';
import { VerificationStatus } from '@common/enums';
import { User } from '@modules/users/entities/user.entity';

@Entity('dietitians')
export class Dietitian extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  // ─── Professional profile (screens 2–3) ───────────────────────────────────
  @Column({ nullable: true }) occupation: string;
  @Column({ type: 'text', nullable: true }) bio: string;
  @Column({ type: 'text', array: true, nullable: true, default: [] }) services: string[];
  @Column({ type: 'jsonb', nullable: true }) socialLinks: Record<string, string>;
  @Column({ type: 'text', array: true, nullable: true, default: [] }) certificates: string[];
  // { initial30: number, followUp60: number, extended90: number }
  @Column({ type: 'jsonb', nullable: true }) sessionFees: Record<string, number>;

  // ─── Availability (screen 4) ───────────────────────────────────────────────
  @Column({ nullable: true }) timezone: string;
  // { monday: { enabled: boolean, slots: [{ from: string, to: string }] }, ... }
  @Column({ type: 'jsonb', nullable: true }) weeklyAvailability: Record<string, any>;

  // ─── Verification ──────────────────────────────────────────────────────────
  @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.PENDING })
  verificationStatus: VerificationStatus;
  @Column({ nullable: true }) adminNotes: string;

  // ─── Stats ─────────────────────────────────────────────────────────────────
  @Column({ type: 'float', default: 0 }) rating: number;
  @Column({ default: 0 }) reviewCount: number;

  // ─── Onboarding flags ──────────────────────────────────────────────────────
  @Column({ default: false }) isBasicProfileComplete: boolean;
  @Column({ default: false }) isProfessionalProfileComplete: boolean;
  @Column({ default: false }) isAvailabilitySet: boolean;
}
