import { YesOrNo } from '../../../../main/definitions/case';
import { GenericTseApplicationTypeItem } from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../../../../main/definitions/constants';
import { application } from '../../../../main/definitions/contact-tribunal-applications';
import { HubLinkStatus } from '../../../../main/definitions/hub';
import { getApplicationContent } from '../../../../main/helpers/controller/ApplicationDetailsHelper';
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
        html: 'link',
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
});
