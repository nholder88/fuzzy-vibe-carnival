import { registerAs } from '@nestjs/config';
import { IsString, IsNumber, IsBoolean, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

class EnvironmentVariables {
  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_NAME: string;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRATION: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  JWT_REFRESH_EXPIRATION: string;

  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @IsString()
  GOOGLE_CALLBACK_URL: string;

  @IsString()
  AUTH_SERVICE_URL: string;

  @IsString()
  CHORE_SERVICE_URL: string;

  @IsString()
  INVENTORY_SERVICE_URL: string;

  @IsString()
  SHOPPING_SERVICE_URL: string;

  @IsString()
  HOUSEHOLD_SERVICE_URL: string;

  @IsString()
  RATE_LIMIT_WINDOW: string;

  @IsNumber()
  RATE_LIMIT_MAX: number;

  @IsNumber()
  PASSWORD_MIN_LENGTH: number;

  @IsBoolean()
  PASSWORD_REQUIRE_SPECIAL: boolean;

  @IsBoolean()
  PASSWORD_REQUIRE_NUMBERS: boolean;

  @IsBoolean()
  PASSWORD_REQUIRE_UPPERCASE: boolean;

  @IsBoolean()
  PASSWORD_REQUIRE_LOWERCASE: boolean;

  @IsString()
  SESSION_SECRET: string;

  @IsString()
  SESSION_EXPIRATION: string;

  @IsBoolean()
  SESSION_COOKIE_SECURE: boolean;

  @IsBoolean()
  SESSION_COOKIE_HTTPONLY: boolean;

  @IsString()
  SESSION_COOKIE_SAMESITE: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
};

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRATION,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION,
}));

export const oauthConfig = registerAs('oauth', () => ({
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
}));

export const serviceConfig = registerAs('services', () => ({
  auth: process.env.AUTH_SERVICE_URL,
  chore: process.env.CHORE_SERVICE_URL,
  inventory: process.env.INVENTORY_SERVICE_URL,
  shopping: process.env.SHOPPING_SERVICE_URL,
  household: process.env.HOUSEHOLD_SERVICE_URL,
}));

export const securityConfig = registerAs('security', () => ({
  rateLimit: {
    window: process.env.RATE_LIMIT_WINDOW,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10),
  },
  password: {
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH, 10),
    requireSpecial: process.env.PASSWORD_REQUIRE_SPECIAL === 'true',
    requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS === 'true',
    requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE === 'true',
    requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE === 'true',
  },
}));

export const sessionConfig = registerAs('session', () => ({
  secret: process.env.SESSION_SECRET,
  expiresIn: process.env.SESSION_EXPIRATION,
  cookie: {
    secure: process.env.SESSION_COOKIE_SECURE === 'true',
    httpOnly: process.env.SESSION_COOKIE_HTTPONLY === 'true',
    sameSite: process.env.SESSION_COOKIE_SAMESITE,
  },
}));
