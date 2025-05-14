import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ensureDatabase } from './config/bootstrap-db';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  // Set global prefix
  app.setGlobalPrefix('api');
  ensureDatabase();

  const port = process.env.PORT || 3003;
  await app.listen(port);
  console.log(`Auth service is running on port ${port}`);
}
bootstrap();
