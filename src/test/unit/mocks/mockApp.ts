import express, { Express } from 'express';

import { app } from '../../../main/app';
import { AppSession } from '../../../main/definitions/appRequest';
import { CaseWithId } from '../../../main/definitions/case';
import { CaseState, TellUsWhatYouWant, TypesOfClaim } from '../../../main/definitions/definition';
import { FormError } from '../../../main/definitions/form';
import { AnyRecord } from '../../../main/definitions/util-types';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';

import { mockUserDetails } from './mockUser';

export function mockSession(
  typeOfClaimList: TypesOfClaim[],
  tellUsWhatYouWantList: TellUsWhatYouWant[],
  errorList: FormError[]
): AppSession {
  return {
    id: 'testSessionId',
    lang: 'en',
    regenerate: this,
    destroy: this,
    reload: this,
    resetMaxAge: this,
    save: this,
    touch: this,
    cookie: {
      originalMaxAge: 3600000,
      expires: new Date(new Date().getDate() + 1),
      httpOnly: true,
      path: '/',
    },
    userCase: {
      id: 'testUserCaseId',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      typeOfClaim: typeOfClaimList,
      tellUsWhatYouWant: tellUsWhatYouWantList,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
    },
    submittedCase: {
      id: 'testUserCaseId',
      state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
      typeOfClaim: typeOfClaimList,
      tellUsWhatYouWant: tellUsWhatYouWantList,
      createdDate: 'August 19, 2022',
      lastModified: 'August 19, 2022',
    },
    errors: errorList,
    guid: 'kedicik6-l0v3-y0u2-t1h3-mehmet9c3d68',
    user: {
      accessToken: 'testAccessToken',
      email: 'et.dev@hmcts.net',
      isCitizen: false,
      id: 'testUserId',
      givenName: 'test',
      familyName: 'user',
    },
    returnUrl: undefined,
    subSectionUrl: undefined,
    contactType: 'Respond',
  };
}

// Logged in but with an empty userCase.
export const mockApp = ({
  body,
  userCase,
  session,
}: {
  body?: AnyRecord;
  userCase?: Partial<CaseWithId>;
  session?: AppSession;
}): Express => {
  const mock = express();
  mock.all('*', function (req, res, next) {
    req.body = body;
    req.session = {
      userCase: {
        id: '1234',
        dobDate: { year: '2000', month: '12', day: '24' },
        typeOfClaim: [],
        contactType: 'Application',
        ...userCase,
      } as CaseWithId,
      ...session,
      save: jest.fn(done => done()),
      lang: 'en',
      errors: undefined,
      user: mockUserDetails,
    } as unknown as AppSession;
    next();
  });
  mock.use(app);
  app.locals.CSRF_DISABLED = true;
  const mockClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockClient.mockResolvedValue(true);

  return mock;
};
