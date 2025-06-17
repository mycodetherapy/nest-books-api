import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { MongoExceptionFilter } from './common/filters/all-exceptions.filter';
import { SuccessInterceptor } from './common/success.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  app.useGlobalFilters(new MongoExceptionFilter());
  app.useGlobalInterceptors(new SuccessInterceptor());

  await app.listen(3000);
}
bootstrap();
