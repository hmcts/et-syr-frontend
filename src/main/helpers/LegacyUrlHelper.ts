import config from 'config';

import { LegacyUrls } from '../definitions/constants';

export const getLegacySignUpUrl = (): string => {
  return config.has('services.et3Legacy.url') ? config.get('services.et3Legacy.url') : LegacyUrls.SIGN_UP;
};
