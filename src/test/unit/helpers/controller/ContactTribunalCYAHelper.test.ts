import { YesOrNo } from '../../../../main/definitions/case';
import { getCyaContent } from '../../../../main/helpers/controller/ContactTribunalCYAHelper';
import applicationTypeJson from '../../../../main/resources/locales/en/translation/application-type.json';
import commonJson from '../../../../main/resources/locales/en/translation/common.json';
import contactTribunalCyaJson from '../../../../main/resources/locales/en/translation/contact-tribunal-check-your-answers.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Contact Tribunal CYA Helper', () => {
  describe('getCyaContent', () => {
    it('should generate the correct summary list for a complete case', () => {
      const translations = {
        ...commonJson,
        ...applicationTypeJson,
        ...contactTribunalCyaJson,
      };
      const req = mockRequestWithTranslation({}, translations);

      const userCase = req.session.userCase;
      userCase.contactApplicationType = 'Strike out all or part of a claim';
      userCase.contactApplicationText = 'Test';
      userCase.contactApplicationFile = {
        document_binary_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa/binary',
        document_size: 1024,
        document_mime_type: 'application/pdf',
        document_filename: 'test-file.pdf',
        document_url: 'http://dm-store:8080/documents/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa',
      };
      userCase.copyToOtherPartyYesOrNo = YesOrNo.NO;
      userCase.copyToOtherPartyText = 'No Reason';

      const expectedRows = [
        {
          key: {
            classes: 'govuk-!-font-weight-regular-m',
            text: translations.applicationType,
          },
          value: {
            text: 'Strike out the claim',
          },
          actions: {
            items: [
              {
                href: '/contact-tribunal?lng=en',
                text: translations.change,
                visuallyHiddenText: translations.applicationType,
              },
            ],
          },
        },
        {
          key: {
            classes: 'govuk-!-font-weight-regular-m',
            text: translations.legend,
          },
          value: {
            text: userCase.contactApplicationText,
          },
          actions: {
            items: [
              {
                href: '/contact-tribunal/strike-out-all-or-part-of-application?lng=en',
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
            html: '<a href="/getCaseDocument/10dbc31c-5bf6-4ecf-9ad7-6bbf58492afa" target="_blank">test-file.pdf</a><br>',
          },
          actions: {
            items: [
              {
                href: '/contact-tribunal/strike-out-all-or-part-of-application?lng=en',
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
                href: '/copy-to-other-party?lng=en',
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
                href: '/copy-to-other-party?lng=en',
                text: translations.change,
                visuallyHiddenText: translations.copyToOtherPartyText,
              },
            ],
          },
        },
      ];

      const cyaContent = getCyaContent(req, translations);

      expect(cyaContent).toEqual(expectedRows);
    });
  });
});
