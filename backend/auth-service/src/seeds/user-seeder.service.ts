import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class UserSeederService {
  private readonly logger = new Logger(UserSeederService.name);

  constructor(private readonly usersService: UsersService) {}

  async seed() {
    this.logger.log('Starting user seeding...');

    // Create test users for e2e testing
    const testUsers = [
      {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
        isVerified: true,
      },
      {
        email: 'admin@example.com',
        password: 'Admin123!',
        firstName: 'Admin',
        lastName: 'User',
        isVerified: true,
      },
    ];

    // Try to create each test user
    for (const userData of testUsers) {
      try {
        const userDto = new CreateUserDto();
        userDto.email = userData.email;
        userDto.password = userData.password;
        userDto.firstName = userData.firstName;
        userDto.lastName = userData.lastName;
        userDto.isVerified = userData.isVerified;

        await this.usersService.create(userDto);
        this.logger.log(`User seeded: ${userData.email}`);
      } catch (error: unknown) {
        // If user already exists, this is fine for our seeding purposes
        if (
          error instanceof Error &&
          error.message.includes('already exists')
        ) {
          this.logger.log(`User already exists: ${userData.email}`);
        } else {
          this.logger.error(`Failed to seed user: ${userData.email}`, error);
        }
      }
    }

    this.logger.log('User seeding completed');
  }
}
