import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingService } from './common/logging/logging.service';
import { LoggingInterceptor } from './common/logging/logging.interceptor';
import { HttpExceptionFilter } from './common/logging/http-exception.filter';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggingService = app.get(LoggingService);

  app.useGlobalFilters(new HttpExceptionFilter(loggingService));
  app.useGlobalInterceptors(new LoggingInterceptor(loggingService));

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
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
}
bootstrap();
