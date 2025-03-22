import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { UserSeederService } from './user-seeder.service';

async function bootstrap() {
  const logger = new Logger('SeedCommand');
  try {
    logger.log('Starting seeding...');

    // Create a full application context with all modules
    const app = await NestFactory.createApplicationContext(AppModule);
    const seederService = app.get(UserSeederService);

    await seederService.seed();

    await app.close();
    logger.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed', error);
    process.exit(1);
  }
}

bootstrap();
