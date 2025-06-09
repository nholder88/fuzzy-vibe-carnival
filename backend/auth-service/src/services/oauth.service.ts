import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { OAuthConfig } from '../config/env.config';

@Injectable()
export class OAuthService {
  constructor(private configService: ConfigService) {}

  getGoogleStrategy() {
    const oauthConfig = this.configService.get<OAuthConfig>('oauth');
    const googleConfig = oauthConfig?.google;

    if (!googleConfig) {
      throw new Error('Google OAuth configuration is missing');
    }

    return new PassportStrategy(Strategy, {
      clientID: googleConfig.clientId,
      clientSecret: googleConfig.clientSecret,
      callbackURL: googleConfig.callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validateGoogleUser(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    };

    done(null, user);
  }
}
