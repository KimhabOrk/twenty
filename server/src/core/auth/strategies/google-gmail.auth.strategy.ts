import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Request } from 'express';

import { EnvironmentService } from 'src/integrations/environment/environment.service';
import { GoogleRequest } from 'src/core/auth/strategies/google.auth.strategy';

export type GoogleGmailRequest = Request & {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    email: string;
    picture: string | null;
    workspaceInviteHash?: string;
    accessToken: string;
    refreshToken: string;
  };
};

@Injectable()
export class GoogleGmailStrategy extends PassportStrategy(
  Strategy,
  'google-gmail',
) {
  constructor(environmentService: EnvironmentService) {
    super({
      clientID: environmentService.getAuthGoogleClientId(),
      clientSecret: environmentService.getAuthGoogleClientSecret(),
      callbackURL: environmentService.getAuthGoogleGmailCallbackUrl(),
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/gmail.readonly',
      ],
      passReqToCallback: true,
    });
  }

  authenticate(req: any, options: any) {
    options = {
      ...options,
      accessType: 'offline',
      prompt: 'consent',
    };

    return super.authenticate(req, options);
  }

  async validate(
    request: GoogleRequest,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    const { name, emails, photos } = profile;

    const user: GoogleGmailRequest['user'] = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos?.[0]?.value,
      accessToken,
      refreshToken,
    };

    done(null, user);
  }
}
