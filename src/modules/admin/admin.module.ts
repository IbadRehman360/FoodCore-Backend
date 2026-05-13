import { Module } from '@nestjs/common';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminDietitiansController } from './controllers/admin-dietitians.controller';
import { AdminAnalyticsController } from './controllers/admin-analytics.controller';
import { UsersModule } from '@modules/users/users.module';
import { DietitiansModule } from '@modules/dietitians/dietitians.module';

@Module({
  imports: [UsersModule, DietitiansModule],
  controllers: [AdminUsersController, AdminDietitiansController, AdminAnalyticsController],
})
export class AdminModule {}
