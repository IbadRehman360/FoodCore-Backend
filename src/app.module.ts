import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { appConfig, databaseConfig, jwtConfig, redisConfig, mailConfig } from '@config/index';
import { RedisModule } from '@database/redis/redis.module';
import { MailModule } from '@modules/mail/mail.module';
import { OtpModule } from '@modules/otp/otp.module';

import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { DietitiansModule } from '@modules/dietitians/dietitians.module';
import { AdminModule } from '@modules/admin/admin.module';
import { MealPlansModule } from '@modules/meal-plans/meal-plans.module';
import { FoodDiaryModule } from '@modules/food-diary/food-diary.module';
import { WaterTrackerModule } from '@modules/water-tracker/water-tracker.module';
import { RecipesModule } from '@modules/recipes/recipes.module';
import { ConsultationsModule } from '@modules/consultations/consultations.module';
import { AiModule } from '@modules/ai/ai.module';
import { PaymentsModule } from '@modules/payments/payments.module';
import { SubscriptionsModule } from '@modules/subscriptions/subscriptions.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { SocialModule } from '@modules/social/social.module';
import { CopyrightModule } from '@modules/copyright/copyright.module';
import { WearablesModule } from '@modules/wearables/wearables.module';
import { ReviewsModule } from '@modules/reviews/reviews.module';

@Module({
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, redisConfig, mailConfig],
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.postgres.host'),
        port: config.get('database.postgres.port'),
        username: config.get('database.postgres.username'),
        password: config.get('database.postgres.password'),
        database: config.get('database.postgres.database'),
        autoLoadEntities: true,
        synchronize: config.get('app.nodeEnv') === 'development',
        logging: config.get('app.nodeEnv') === 'development',
      }),
      inject: [ConfigService],
    }),

    ThrottlerModule.forRootAsync({
      useFactory: (config: ConfigService) => [
        { ttl: config.get('THROTTLE_TTL') ?? 60, limit: config.get('THROTTLE_LIMIT') ?? 100 },
      ],
      inject: [ConfigService],
    }),

    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    RedisModule,
    MailModule,
    OtpModule,

    AuthModule,
    UsersModule,
    DietitiansModule,
    AdminModule,
    MealPlansModule,
    FoodDiaryModule,
    WaterTrackerModule,
    RecipesModule,
    ConsultationsModule,
    AiModule,
    PaymentsModule,
    SubscriptionsModule,
    NotificationsModule,
    SocialModule,
    CopyrightModule,
    WearablesModule,
    ReviewsModule,
  ],
})
export class AppModule {}
