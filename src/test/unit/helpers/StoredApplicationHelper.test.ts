import { UserDetails } from '../../../main/definitions/appRequest';
import { YesOrNo } from '../../../main/definitions/case';
import { GenericTseApplicationTypeItem } from '../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../../../main/definitions/constants';
import { application } from '../../../main/definitions/contact-tribunal-applications';
import {
  getRespondentTse,
  getSelectedStoredApplication,
  getYourStoredApplicationList,
} from '../../../main/helpers/StoredApplicationHelper';
import { mockRequest } from '../mocks/mockRequest';

describe('StoredApplicationHelper', () => {
  const user: UserDetails = {
    accessToken: 'token',
    id: 'user1',
    email: 'test@example.com',
    givenName: 'Test',
    familyName: 'User',
    isCitizen: true,
  };

  const appItem: GenericTseApplicationTypeItem = {
    id: 'app1',
    value: {
      applicant: Applicant.RESPONDENT,
      applicantIdamId: 'user1',
      type: application.CHANGE_PERSONAL_DETAILS.code,
      details: 'details',
      documentUpload: {
        document_url: 'url',
        document_filename: 'file',
        document_binary_url: 'binurl',
      },
      copyToOtherPartyYesOrNo: YesOrNo.YES,
    },
  };

  describe('getSelectedStoredApplication', () => {
    it('should return the selected application by id', () => {
      const req = mockRequest({
        session: {
          user,
          userCase: {
            tseRespondentStoredCollection: [appItem],
          },
        },
      });
      req.params.appId = 'app1';
      const result = getSelectedStoredApplication(req);
      expect(result).toEqual(appItem);
    });

    it('should return undefined if not found', () => {
      const req = mockRequest({
        session: {
          user,
          userCase: {
            tseRespondentStoredCollection: [appItem],
          },
        },
      });
      req.params.appId = 'notfound';
      const result = getSelectedStoredApplication(req);
      expect(result).toBeUndefined();
    });
  });

  describe('getYourStoredApplicationList', () => {
    it('should return applications belonging to the user', () => {
      const req = mockRequest({
        session: {
          user,
          userCase: {
            tseRespondentStoredCollection: [
              appItem,
              {
                id: 'app2',
                value: {
                  ...appItem.value,
                  applicantIdamId: 'other',
                },
              },
            ],
          },
        },
      });
      const result = getYourStoredApplicationList(req);
      expect(result).toEqual([appItem]);
    });

    it('should return empty array if none belong to user', () => {
      const req = mockRequest({
        session: {
          user,
          userCase: {
            tseRespondentStoredCollection: [
              {
                id: 'app2',
                value: {
                  ...appItem.value,
                  applicantIdamId: 'other',
                },
              },
            ],
          },
        },
      });
      const result = getYourStoredApplicationList(req);
      expect(result).toEqual([]);
    });
  });

  describe('getRespondentTse', () => {
    it('should map application and user to RespondentTse', () => {
      const result = getRespondentTse(user, appItem);
      expect(result).toEqual({
        respondentIdamId: 'user1',
        contactApplicationType: 'Change personal details',
        contactApplicationClaimantType: 'Change my personal details',
        contactApplicationText: 'details',
        contactApplicationFile: {
          document_url: 'url',
          document_filename: 'file',
          document_binary_url: 'binurl',
        },
        copyToOtherPartyYesOrNo: 'Yes',
        storedApplicationId: 'app1',
      });
    });
  });
});
