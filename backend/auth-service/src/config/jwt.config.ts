import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || 'your_jwt_secret',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRATION || '3600s',
  },
};
