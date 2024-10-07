import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-google-oauth20';

import { EnvironmentService } from 'src/engine/core-modules/environment/environment.service';
import { GOOGLE_APIS_OAUTH_SCOPES } from 'src/engine/core-modules/auth/constants/google-apis-oauth-scopes';

export type GoogleAPIScopeConfig = {
  isCalendarEnabled?: boolean;
  isMessagingAliasFetchingEnabled?: boolean;
};

@Injectable()
export class GoogleAPIsOauthCommonStrategy extends PassportStrategy(
  Strategy,
  'google-apis',
) {
  constructor(
    environmentService: EnvironmentService,
    scopeConfig: GoogleAPIScopeConfig,
  ) {
    super({
      clientID: environmentService.get('AUTH_GOOGLE_CLIENT_ID'),
      clientSecret: environmentService.get('AUTH_GOOGLE_CLIENT_SECRET'),
      callbackURL: environmentService.get('AUTH_GOOGLE_APIS_CALLBACK_URL'),
      scope: GOOGLE_APIS_OAUTH_SCOPES,
      passReqToCallback: true,
    });
  }
}
