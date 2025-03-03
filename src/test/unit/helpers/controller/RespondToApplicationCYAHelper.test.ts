import { YesOrNo } from '../../../../main/definitions/case';
import { Applicant } from '../../../../main/definitions/constants';
import { getCyaContent } from '../../../../main/helpers/controller/RespondToApplicationCYAHelper';
import applicationTypeJson from '../../../../main/resources/locales/en/translation/application-type.json';
import commonJson from '../../../../main/resources/locales/en/translation/common.json';
import respondToApplicationCyaJson from '../../../../main/resources/locales/en/translation/respond-to-application-check-your-answers.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Respond to Application CYA Helper', () => {
  describe('getCyaContent', () => {
    it('should generate the correct summary list for a complete case', () => {
      const translations = {
        ...commonJson,
        ...applicationTypeJson,
        ...respondToApplicationCyaJson,
      };
      const req = mockRequestWithTranslation({}, translations);

      const userCase = req.session.userCase;
      userCase.selectedGenericTseApplication = {
        id: '1',
        value: {
          applicant: Applicant.RESPONDENT,
          date: '2022-05-05',
          type: 'Amend response',
        },
      };
      userCase.responseText = 'Strike out all or part of a claim';
      userCase.hasSupportingMaterial = YesOrNo.YES;
      userCase.supportingMaterialFile = {
        document_url: 'http://dm-store:8080/documents/6cd4768b-d9f8-4e39-b8e3-672f0047aa88',
        document_filename: 'TEST.txt',
        document_binary_url: 'http://dm-store:8080/documents/6cd4768b-d9f8-4e39-b8e3-672f0047aa88/binary',
      };
      userCase.copyToOtherPartyYesOrNo = YesOrNo.NO;
      userCase.copyToOtherPartyText = 'No Reason';

      const expectedRows = [
        {
          key: {
            classes: 'govuk-!-font-weight-regular-m',
            text: translations.legend,
          },
          value: {
            text: userCase.responseText,
          },
          actions: {
            items: [
              {
                href: '/respond-to-application/1?lng=en',
                text: translations.change,
                visuallyHiddenText: translations.legend,
              },
            ],
          },
        },
        {
          key: {
            classes: 'govuk-!-font-weight-regular-m',
            text: translations.supportingMaterial,
          },
          value: {
            html: '<a href="/getSupportingMaterial/6cd4768b-d9f8-4e39-b8e3-672f0047aa88" target="_blank">TEST.txt</a><br>',
          },
          actions: {
            items: [
              {
                href: '/respond-to-application-supporting-material?lng=en',
                text: translations.change,
                visuallyHiddenText: translations.supportingMaterial,
              },
            ],
          },
        },
        {
          key: {
            classes: 'govuk-!-font-weight-regular-m',
            text: translations.copyToOtherPartyYesOrNo,
          },
          value: {
            text: 'No',
          },
          actions: {
            items: [
              {
                href: '/respond-to-application-copy-to-other-party?lng=en',
                text: translations.change,
                visuallyHiddenText: translations.copyToOtherPartyYesOrNo,
              },
            ],
          },
        },
        {
          key: {
            classes: 'govuk-!-font-weight-regular-m',
            text: translations.copyToOtherPartyText,
          },
          value: {
            text: userCase.copyToOtherPartyText,
          },
          actions: {
            items: [
              {
                href: '/respond-to-application-copy-to-other-party?lng=en',
                text: translations.change,
                visuallyHiddenText: translations.copyToOtherPartyText,
              },
            ],
          },
        },
      ];

      const cyaContent = getCyaContent(req);

      expect(cyaContent).toEqual(expectedRows);
    });
  });
});
