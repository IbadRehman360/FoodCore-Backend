import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  gmailUser: process.env.GMAIL_ACCOUNT_EMAIL ?? '',
  gmailPassword: process.env.GMAIL_ACCOUNT_PASSWORD ?? '',
  fromEmail: process.env.GMAIL_ACCOUNT_EMAIL ?? 'noreply@foodcure.app',
  fromName: 'FoodCure',
}));
