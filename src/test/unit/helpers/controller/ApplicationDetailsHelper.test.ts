import { YesOrNo } from '../../../../main/definitions/case';
import { GenericTseApplicationType } from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant, PartiesNotify } from '../../../../main/definitions/constants';
import { application } from '../../../../main/definitions/contact-tribunal-applications';
import {
  getAllResponses,
  getApplicationContent,
  getDecisionContent,
  isNeverResponseBefore,
} from '../../../../main/helpers/controller/ApplicationDetailsHelper';
import applicationDetailsJson from '../../../../main/resources/locales/en/translation/application-details.json';
import applicationTypeJson from '../../../../main/resources/locales/en/translation/application-type.json';
import commonJson from '../../../../main/resources/locales/en/translation/common.json';
import { mockGenericTseCollection } from '../../mocks/mockGenericTseCollection';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';
import { mockUserDetails } from '../../mocks/mockUser';

describe('Application Details Helper', () => {
  describe('getApplicationContent', () => {
    const translations = {
      ...commonJson,
      ...applicationTypeJson,
      ...applicationDetailsJson,
    };
    const req = mockRequestWithTranslation({}, translations);

    it('should return a SummaryListRow array with some fields', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.RESPONDENT,
        date: '2022-05-05',
        type: application.AMEND_RESPONSE.code,
        copyToOtherPartyYesOrNo: YesOrNo.YES,
        details: 'Test application details text',
        number: '1',
        dueDate: '2022-05-12',
      };
      const result = getApplicationContent(app, req);
      expect(result).toHaveLength(5);
      expect(result[0].key.text).toEqual('Applicant');
      expect(result[0].value.text).toEqual('Respondent');
      expect(result[1].key.text).toEqual('Application date');
      expect(result[1].value.text).toEqual('5 May 2022');
      expect(result[2].key.text).toEqual('Application type');
      expect(result[2].value.text).toEqual('Amend my response');
      expect(result[3].key.text).toEqual('What do you want to tell or ask the tribunal?');
      expect(result[3].value.text).toEqual('Test application details text');
      expect(result[4].key.text).toEqual(
        'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?'
      );
      expect(result[4].value.text).toEqual(YesOrNo.YES);
    });

    it('should return a SummaryListRow array with some missing fields', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.RESPONDENT,
        date: '2022-05-05',
        type: Applicant.RESPONDENT,
        copyToOtherPartyYesOrNo: YesOrNo.NO,
        copyToOtherPartyText: 'No details',
        number: '1',
        dueDate: '2022-05-12',
        documentUpload: {
          document_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa',
          document_filename: 'test-file.pdf',
          document_binary_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa/binary',
          createdOn: 'Test date',
          document_size: 5,
          document_mime_type: 'pdf',
        },
      };
      const result = getApplicationContent(app, req);
      expect(result).toHaveLength(6);
      expect(result[3].key.text).toEqual('Supporting material');
      expect(result[3].value.html).toEqual(
        '<a href="/getSupportingMaterial/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa" target="_blank">test-file.pdf</a><br>'
      );
      expect(result[4].key.text).toEqual(
        'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?'
      );
      expect(result[4].value.text).toEqual(YesOrNo.NO);
      expect(result[5].key.text).toEqual('Reason for not informing other party');
      expect(result[5].value.text).toEqual('No details');
    });
  });

  describe('getAllResponses', () => {
    const translations = {
      ...commonJson,
      ...applicationDetailsJson,
    };
    const req = mockRequestWithTranslation({}, translations);
    req.session.user.id = '4d148fe6-3fc9-408f-9d6a-7e93fa5533d4';

    it('should return Claimant application responses', () => {
      const result = getAllResponses(mockGenericTseCollection[0].value, req);
      expect(result).toHaveLength(3);

      expect(result[0]).toHaveLength(12);
      expect(result[0][0].key.text).toEqual('Response');
      expect(result[0][0].value.text).toEqual('Title 1-1');
      expect(result[0][1].key.text).toEqual('Date');
      expect(result[0][1].value.text).toEqual('3 February 2025');
      expect(result[0][2].key.text).toEqual('Sent by');
      expect(result[0][2].value.text).toEqual('Tribunal');
      expect(result[0][3].key.text).toEqual('Case management order or request?');
      expect(result[0][3].value.text).toEqual('Request');
      expect(result[0][4].key.text).toEqual('Response due');
      expect(result[0][4].value.text).toEqual('Yes');
      expect(result[0][5].key.text).toEqual('Party or parties to respond');
      expect(result[0][5].value.text).toEqual('Both parties');
      expect(result[0][6].key.text).toEqual('Additional information');
      expect(result[0][6].value.text).toEqual('Additional information 1-1');
      expect(result[0][7].key.text).toEqual('Description');
      expect(result[0][7].value.text).toEqual('Short description 1-1-1');
      expect(result[0][8].key.text).toEqual('Document');
      expect(result[0][8].value.html).toEqual(
        '<a href="/getSupportingMaterial/cdaf047b-492a-4d8a-8f6b-2c075d2fd44d" target="_blank">Test.pdf</a><br>'
      );
      expect(result[0][9].key.text).toEqual('Request made by');
      expect(result[0][9].value.text).toEqual('Judge');
      expect(result[0][10].key.text).toEqual('Name');
      expect(result[0][10].value.text).toEqual('Full Name');
      expect(result[0][11].key.text).toEqual('Sent to');
      expect(result[0][11].value.text).toEqual('Both parties');

      expect(result[1]).toHaveLength(4);
      expect(result[1][0].key.text).toEqual('Response from');
      expect(result[1][0].value.text).toEqual('Respondent');
      expect(result[1][1].key.text).toEqual('Response date');
      expect(result[1][1].value.text).toEqual('4 February 2025');
      expect(result[1][2].key.text).toEqual('Supporting material');
      expect(result[1][2].value.html).toEqual(
        '<a href="/getSupportingMaterial/6cd4768b-d9f8-4e39-b8e3-672f0047aa88" target="_blank">TEST.txt</a><br>'
      );
      expect(result[1][3].key.text).toEqual(
        'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?'
      );
      expect(result[1][3].value.text).toEqual('Yes');

      expect(result[2]).toHaveLength(5);
      expect(result[2][0].key.text).toEqual('Response from');
      expect(result[2][0].value.text).toEqual('Claimant');
      expect(result[2][1].key.text).toEqual('Response date');
      expect(result[2][1].value.text).toEqual('4 February 2025');
      expect(result[2][2].key.text).toEqual("What's your response to the application?");
      expect(result[2][2].value.text).toEqual('response 1-C');
      expect(result[2][3].key.text).toEqual('Supporting material');
      expect(result[2][3].value.html).toEqual(
        '<a href="/getSupportingMaterial/fa26d905-9f87-4232-beb6-c6b3a730e34f" target="_blank">Application 1 - Amend my claim - Attachment.txt</a><br>'
      );
      expect(result[2][4].key.text).toEqual(
        'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?'
      );
      expect(result[2][4].value.text).toEqual('Yes');
    });

    it('should return all responses before Admin share', () => {
      const app: GenericTseApplicationType = {
        respondCollection: [
          {
            value: {
              from: Applicant.RESPONDENT,
              fromIdamId: '4d148fe6-3fc9-408f-9d6a-7e93fa5533d4',
              date: '2025-02-11',
              copyToOtherParty: YesOrNo.NO,
            },
          },
          {
            value: {
              from: Applicant.RESPONDENT,
              fromIdamId: '05e628f7-2182-4fc6-a57d-21425c358f7e',
              date: '2025-02-12',
              copyToOtherParty: YesOrNo.NO,
            },
          },
          {
            value: {
              from: Applicant.CLAIMANT,
              date: '2025-02-13',
              copyToOtherParty: YesOrNo.NO,
            },
          },
          {
            value: {
              from: Applicant.ADMIN,
              date: '2025-02-14',
              isCmoOrRequest: 'Case management order',
              isResponseRequired: YesOrNo.NO,
              selectPartyNotify: PartiesNotify.BOTH_PARTIES,
            },
          },
          {
            value: {
              from: Applicant.RESPONDENT,
              fromIdamId: '4d148fe6-3fc9-408f-9d6a-7e93fa5533d4',
              date: '2025-02-15',
              copyToOtherParty: YesOrNo.NO,
            },
          },
          {
            value: {
              from: Applicant.CLAIMANT,
              date: '2025-02-16',
              copyToOtherParty: YesOrNo.NO,
            },
          },
          {
            value: {
              from: Applicant.RESPONDENT,
              fromIdamId: '05e628f7-2182-4fc6-a57d-21425c358f7e',
              date: '2025-02-17',
              copyToOtherParty: YesOrNo.NO,
            },
          },
        ],
      };
      const result = getAllResponses(app, req);
      expect(result).toHaveLength(5);

      expect(result[0]).toHaveLength(3);
      expect(result[0][0].value.text).toEqual('Respondent');
      expect(result[0][1].value.text).toEqual('11 February 2025');
      expect(result[0][2].value.text).toEqual('No');

      expect(result[1]).toHaveLength(3);
      expect(result[1][0].value.text).toEqual('Respondent');
      expect(result[1][1].value.text).toEqual('12 February 2025');
      expect(result[1][2].value.text).toEqual('No');

      expect(result[2]).toHaveLength(3);
      expect(result[2][0].value.text).toEqual('Claimant');
      expect(result[2][1].value.text).toEqual('13 February 2025');
      expect(result[2][2].value.text).toEqual('No');

      expect(result[3]).toHaveLength(5);
      expect(result[3][0].value.text).toEqual('14 February 2025');
      expect(result[3][1].value.text).toEqual('Tribunal');
      expect(result[3][2].value.text).toEqual('Case management order');
      expect(result[3][3].value.text).toEqual('No');
      expect(result[3][4].value.text).toEqual('Both parties');

      expect(result[4]).toHaveLength(3);
      expect(result[4][0].value.text).toEqual('Respondent');
      expect(result[4][1].value.text).toEqual('15 February 2025');
      expect(result[4][2].value.text).toEqual('No');
    });

    it('should return empty array if application undefined', () => {
      const result = getAllResponses(undefined, req);
      expect(result).toEqual([]);
    });

    it('should return empty array if respondCollection undefined', () => {
      const app: GenericTseApplicationType = {
        respondCollection: undefined,
      };
      const result = getAllResponses(app, req);
      expect(result).toEqual([]);
    });

    it('should return empty array if no respondCollection exists', () => {
      const app: GenericTseApplicationType = {
        respondCollection: [],
      };
      const result = getAllResponses(app, req);
      expect(result).toEqual([]);
    });
  });

  describe('getDecisionContent', () => {
    const translations = {
      ...commonJson,
      ...applicationDetailsJson,
    };

    const req = mockRequestWithTranslation({}, translations);

    it('should return a SummaryListRow array with decision details', () => {
      const app: GenericTseApplicationType = {
        adminDecision: [
          {
            value: {
              enterNotificationTitle: 'Decision Notification',
              decision: 'Granted',
              date: '2022-05-10',
              typeOfDecision: 'Judgment',
              additionalInformation: 'Additional details',
              responseRequiredDoc: [
                {
                  value: {
                    uploadedDocument: {
                      document_filename: 'test-doc-1.pdf',
                      document_binary_url: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673/binary',
                      document_url: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673',
                    },
                  },
                },
                {
                  value: {
                    uploadedDocument: {
                      document_filename: 'test-doc-2.pdf',
                      document_binary_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa/binary',
                      document_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa',
                    },
                  },
                },
              ],
              decisionMadeBy: 'Judge',
              decisionMadeByFullName: 'Tribunal Admin',
              selectPartyNotify: PartiesNotify.BOTH_PARTIES,
            },
          },
        ],
      };

      const results = getDecisionContent(app, req);
      expect(results).toHaveLength(1);

      const result = results[0];

      expect(result[0].key.text).toEqual('Notification');
      expect(result[0].value.text).toEqual('Decision Notification');

      expect(result[1].key.text).toEqual('Decision');
      expect(result[1].value.text).toEqual('Granted');

      expect(result[2].key.text).toEqual('Date');
      expect(result[2].value.text).toEqual('10 May 2022');

      expect(result[3].key.text).toEqual('Sent by');
      expect(result[3].value.text).toEqual('Tribunal');

      expect(result[4].key.text).toEqual('Type of decision');
      expect(result[4].value.text).toEqual('Judgment');

      expect(result[5].key.text).toEqual('Additional information');
      expect(result[5].value.text).toEqual('Additional details');

      expect(result[6].key.text).toEqual('Document');
      expect(result[6].value.html).toEqual(
        '<a href="/getSupportingMaterial/3aa7dfc1-378b-4fa8-9a17-89126fae5673" target="_blank">test-doc-1.pdf</a><br>' +
          '<a href="/getSupportingMaterial/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa" target="_blank">test-doc-2.pdf</a><br>'
      );
      expect(result[7].key.text).toEqual('Decision made by');
      expect(result[7].value.text).toEqual('Judge');

      expect(result[8].key.text).toEqual('Name');
      expect(result[8].value.text).toEqual('Tribunal Admin');

      expect(result[9].key.text).toEqual('Sent to');
      expect(result[9].value.text).toEqual('Both parties');
    });

    it('should return an empty array if application is undefined', () => {
      const result = getDecisionContent(undefined, req);
      expect(result).toHaveLength(0);
    });

    it('should return an empty array if application is empty', () => {
      const app: GenericTseApplicationType = {};
      const result = getDecisionContent(app, req);
      expect(result).toHaveLength(0);
    });
  });

  describe('isNeverResponseBefore', () => {
    test('returns true if the application does not belong to the user and user has never responded', () => {
      const app: GenericTseApplicationType = {
        respondCollection: [],
      };
      expect(isNeverResponseBefore(app, mockUserDetails)).toBe(true);
    });

    test('returns true if user has not responded and application does not belong to them', () => {
      const app: GenericTseApplicationType = {
        respondCollection: [{ value: { fromIdamId: 'test' } }],
      };
      expect(isNeverResponseBefore(app, mockUserDetails)).toBe(true);
    });

    test('returns false if the application belongs to the user', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.RESPONDENT,
        applicantIdamId: '1234',
        respondCollection: [],
      };
      expect(isNeverResponseBefore(app, mockUserDetails)).toBe(false);
    });

    test('returns false if the user has responded before', () => {
      const app: GenericTseApplicationType = {
        respondCollection: [{ value: { fromIdamId: '1234' } }],
      };
      expect(isNeverResponseBefore(app, mockUserDetails)).toBe(false);
    });

    test('returns true if respondCollection is undefined', () => {
      const app: GenericTseApplicationType = {
        applicant: Applicant.RESPONDENT,
      };
      expect(isNeverResponseBefore(app, mockUserDetails)).toBe(true);
    });

    test('returns true if application is undefined', () => {
      expect(isNeverResponseBefore(undefined, mockUserDetails)).toBe(false);
    });
  });
});
