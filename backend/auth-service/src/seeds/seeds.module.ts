import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UserSeederService } from './user-seeder.service';

@Module({
  imports: [UsersModule],
  providers: [UserSeederService],
  exports: [UserSeederService],
})
export class SeedsModule {}
