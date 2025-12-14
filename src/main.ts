import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LoggingService } from './common/logging/logging.service';
import { LoggingInterceptor } from './common/logging/logging.interceptor';
import { HttpExceptionFilter } from './common/logging/http-exception.filter';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggingService = app.get(LoggingService);
  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  const configService = app.get(ConfigService);

  app.useGlobalFilters(new HttpExceptionFilter(loggingService));
  app.useGlobalInterceptors(new LoggingInterceptor(loggingService));
  app.useGlobalGuards(new JwtAuthGuard(jwtService, configService, reflector));

  process.on('uncaughtException', (error: Error) => {
    loggingService.error('Uncaught Exception', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    loggingService.error('Unhandled Rejection', { reason, promise });
    process.exit(1);
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service API')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
}
bootstrap();
