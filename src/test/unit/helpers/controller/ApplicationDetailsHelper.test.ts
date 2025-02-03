import { YesOrNo } from '../../../../main/definitions/case';
import { GenericTseApplicationTypeItem } from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import {
  AdminDecision,
  Applicant,
  Parties,
  TribunalMadeBy,
  TypeOfDecision,
} from '../../../../main/definitions/constants';
import { application } from '../../../../main/definitions/contact-tribunal-applications';
import { HubLinkStatus } from '../../../../main/definitions/hub';
import {
  getApplicationContent,
  getDecisionContent,
  isResponseToTribunalRequired,
} from '../../../../main/helpers/controller/ApplicationDetailsHelper';
import applicationDetailsJson from '../../../../main/resources/locales/en/translation/application-details.json';
import applicationTypeJson from '../../../../main/resources/locales/en/translation/application-type.json';
import commonJson from '../../../../main/resources/locales/en/translation/common.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Application Details Helper', () => {
  const summaryListClass = 'govuk-!-font-weight-regular-m';

  describe('getApplicationContent', () => {
    const translations = {
      ...commonJson,
      ...applicationTypeJson,
      ...applicationDetailsJson,
    };
    const mockReq = mockRequestWithTranslation({}, translations);

    it('should return a SummaryListRow array with some fields', () => {
      const mockApp: GenericTseApplicationTypeItem = {
        id: '1',
        value: {
          applicant: Applicant.RESPONDENT,
          date: '2022-05-05',
          type: application.AMEND_RESPONSE.code,
          copyToOtherPartyYesOrNo: YesOrNo.YES,
          details: 'Test application details text',
          number: '1',
          status: HubLinkStatus.NOT_VIEWED,
          dueDate: '2022-05-12',
          applicationState: HubLinkStatus.NOT_VIEWED,
        },
      };
      const result = getApplicationContent(mockApp, mockReq);
      expect(result).toHaveLength(5);
      expect(result[0].key).toEqual({ classes: summaryListClass, text: 'Applicant' });
      expect(result[0].value).toEqual({ text: 'Respondent' });
      expect(result[1].key).toEqual({ classes: summaryListClass, text: 'Application date' });
      expect(result[1].value).toEqual({ text: '5 May 2022' });
      expect(result[2].key).toEqual({ classes: summaryListClass, text: 'Application type' });
      expect(result[2].value).toEqual({ text: 'Amend my response' });
      expect(result[3].key).toEqual({
        classes: summaryListClass,
        text: 'What do you want to tell or ask the tribunal?',
      });
      expect(result[3].value).toEqual({ text: 'Test application details text' });
      expect(result[4].key).toEqual({
        classes: summaryListClass,
        text: 'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?',
      });
      expect(result[4].value).toEqual({ text: YesOrNo.YES });
    });

    it('should return a SummaryListRow array with some missing fields', () => {
      const mockApp: GenericTseApplicationTypeItem = {
        id: '1',
        value: {
          applicant: Applicant.RESPONDENT,
          date: '2022-05-05',
          type: Applicant.RESPONDENT,
          copyToOtherPartyYesOrNo: YesOrNo.NO,
          copyToOtherPartyText: 'No details',
          number: '1',
          status: HubLinkStatus.NOT_VIEWED,
          dueDate: '2022-05-12',
          applicationState: HubLinkStatus.NOT_VIEWED,
          documentUpload: {
            document_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa',
            document_filename: 'test-file.pdf',
            document_binary_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa/binary',
            createdOn: 'Test date',
            document_size: 5,
            document_mime_type: 'pdf',
          },
        },
      };
      const result = getApplicationContent(mockApp, mockReq);
      expect(result).toHaveLength(6);
      expect(result[3].key).toEqual({ classes: summaryListClass, text: 'Supporting material' });
      expect(result[3].value).toEqual({
        html: '<a href="/getCaseDocument/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa" target="_blank">test-file.pdf</a><br>',
      });
      expect(result[4].key).toEqual({
        classes: summaryListClass,
        text: 'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?',
      });
      expect(result[4].value).toEqual({ text: YesOrNo.NO });
      expect(result[5].key).toEqual({
        classes: summaryListClass,
        text: 'Reason for not informing other party',
      });
      expect(result[5].value).toEqual({ text: 'No details' });
    });
  });

  describe('getDecisionContent', () => {
    const translations = {
      ...commonJson,
      ...applicationDetailsJson,
    };

    const mockReq = mockRequestWithTranslation({}, translations);

    it('should return a SummaryListRow array with decision details', () => {
      // Mock application data with admin decisions
      const mockApp: GenericTseApplicationTypeItem = {
        id: '1',
        value: {
          adminDecision: [
            {
              value: {
                enterNotificationTitle: 'Decision Notification',
                decision: AdminDecision.GRANTED,
                date: '2022-05-10',
                typeOfDecision: TypeOfDecision.JUDGMENT,
                additionalInformation: 'Additional details',
                responseRequiredDoc: [
                  {
                    value: {
                      uploadedDocument: {
                        document_filename: 'test-doc-1.pdf',
                        document_binary_url:
                          'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673/binary',
                        document_url: 'http://dm-store:8080/documents/3aa7dfc1-378b-4fa8-9a17-89126fae5673',
                      },
                    },
                  },
                  {
                    value: {
                      uploadedDocument: {
                        document_filename: 'test-doc-2.pdf',
                        document_binary_url:
                          'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa/binary',
                        document_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa',
                      },
                    },
                  },
                ],
                decisionMadeBy: TribunalMadeBy.JUDGE,
                decisionMadeByFullName: 'Tribunal Admin',
                selectPartyNotify: Parties.BOTH_PARTIES,
              },
            },
          ],
        },
      };

      const results = getDecisionContent(mockApp, mockReq);

      expect(results).toHaveLength(1);

      const result = results[0];

      expect(result[0].key).toEqual({ classes: summaryListClass, text: translations.notification });
      expect(result[0].value).toEqual({ text: 'Decision Notification' });
      expect(result[1].key).toEqual({ classes: summaryListClass, text: translations.decision });
      expect(result[1].value).toEqual({ text: 'Granted' });
      expect(result[2].key).toEqual({ classes: summaryListClass, text: translations.date });
      expect(result[2].value).toEqual({ text: '10 May 2022' });
      expect(result[3].key).toEqual({ classes: summaryListClass, text: translations.sentBy });
      expect(result[3].value).toEqual({ text: translations.tribunal });
      expect(result[4].key).toEqual({ classes: summaryListClass, text: translations.decisionType });
      expect(result[4].value).toEqual({ text: 'Judgment' });
      expect(result[5].key).toEqual({ classes: summaryListClass, text: translations.additionalInfo });
      expect(result[5].value).toEqual({ text: 'Additional details' });
      expect(result[6].key).toEqual({ classes: summaryListClass, text: translations.document });
      expect(result[6].value).toEqual({
        html:
          '<a href="/getCaseDocument/3aa7dfc1-378b-4fa8-9a17-89126fae5673" target="_blank">test-doc-1.pdf</a><br>' +
          '<a href="/getCaseDocument/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa" target="_blank">test-doc-2.pdf</a><br>',
      });
      expect(result[7].key).toEqual({ classes: summaryListClass, text: translations.decisionMadeBy });
      expect(result[7].value).toEqual({ text: 'Judge' });
      expect(result[8].key).toEqual({ classes: summaryListClass, text: translations.name });
      expect(result[8].value).toEqual({ text: 'Tribunal Admin' });
      expect(result[9].key).toEqual({ classes: summaryListClass, text: translations.sentTo });
      expect(result[9].value).toEqual({ text: 'Both parties' });
    });

    it('should return an empty array if adminDecision is not present', () => {
      const mockApp: GenericTseApplicationTypeItem = {
        id: '2',
        value: {},
      };
      const result = getDecisionContent(mockApp, mockReq);
      expect(result).toHaveLength(0); // Expecting empty array when adminDecision is not present
    });
  });

  describe('isResponseToTribunalRequired', () => {
    it('should return true if claimantResponseRequired is YES', () => {
      const mockApp = { value: { respondentResponseRequired: YesOrNo.YES } };
      expect(isResponseToTribunalRequired(mockApp)).toBe(true);
    });

    it('should return false if claimantResponseRequired is not YES', () => {
      const mockApp = { value: { respondentResponseRequired: YesOrNo.NO } };
      expect(isResponseToTribunalRequired(mockApp)).toBe(false);
    });
  });
});
