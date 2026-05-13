import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { globalValidationPipe } from '@common/pipes';
import { HttpExceptionFilter, AllExceptionsFilter } from '@common/filters';
import { ResponseInterceptor, LoggingInterceptor } from '@common/interceptors';
import { JwtAuthGuard, RolesGuard } from '@common/guards';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });
  const config = app.get(ConfigService);
  const reflector = app.get(Reflector);

  app.setGlobalPrefix(config.get('app.apiPrefix'));
  app.enableCors({ origin: config.get('app.frontendUrl'), credentials: true });
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
          connectSrc: ["'self'"],
        },
      },
    }),
  );
  app.use(compression());

  app.useGlobalPipes(globalValidationPipe);
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseInterceptor());
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('FoodCure API')
    .setDescription('FoodCure backend REST API — v1')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  const port = config.get<number>('app.port');
  await app.listen(port);
  console.log(`FoodCure API running on http://localhost:${port}/api/v1`);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
}

bootstrap();
