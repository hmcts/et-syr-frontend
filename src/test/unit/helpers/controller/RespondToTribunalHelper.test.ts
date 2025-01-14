import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { Applicant, ValidationErrors } from '../../../../main/definitions/constants';
import {
  clearTempFields,
  getCyaContent,
  getFormDataError,
} from '../../../../main/helpers/controller/RespondToTribunalHelper';
import applicationTypeJson from '../../../../main/resources/locales/en/translation/application-type.json';
import commonJson from '../../../../main/resources/locales/en/translation/common.json';
import respondToTribunalCyaJson from '../../../../main/resources/locales/en/translation/respond-to-tribunal-check-your-answers.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Respond to Tribunal Helper', () => {
  describe('getFormDataError', () => {
    it('should return error when responseText is filled and hasSupportingMaterial is not selected', () => {
      const formData = { responseText: 'test' };
      const error = getFormDataError(formData);
      expect(error).toEqual({ propertyName: 'hasSupportingMaterial', errorType: ValidationErrors.REQUIRED });
    });

    it('should return errors when responseText is empty and hasSupportingMaterial is not selected', () => {
      const formData = {};
      const error = getFormDataError(formData);
      expect(error).toEqual({ propertyName: 'responseText', errorType: ValidationErrors.REQUIRED });
    });

    it('should return errors when responseText is empty and hasSupportingMaterial is No', () => {
      const formData = { hasSupportingMaterial: YesOrNo.NO };
      const error = getFormDataError(formData);
      expect(error).toEqual({ propertyName: 'responseText', errorType: 'requiredFile' });
    });

    it('should return error when responseText is too long and hasSupportingMaterial is selected', () => {
      const longText = 'a'.repeat(2501);
      const formData = { responseText: longText, hasSupportingMaterial: YesOrNo.YES };
      const error = getFormDataError(formData);
      expect(error).toEqual({ propertyName: 'responseText', errorType: ValidationErrors.TOO_LONG });
    });

    it('should return no errors when responseText is filled and hasSupportingMaterial is Yes', () => {
      const formData = { responseText: '', hasSupportingMaterial: YesOrNo.YES };
      const errors = getFormDataError(formData);
      expect(errors).toBeUndefined();
    });

    it('should return no errors when responseText is filled and hasSupportingMaterial is selected', () => {
      const validText = 'a'.repeat(2500);
      const formData = { responseText: validText, hasSupportingMaterial: YesOrNo.NO };
      const errors = getFormDataError(formData);
      expect(errors).toBeUndefined();
    });
  });

  describe('getCyaContent', () => {
    it('should generate the correct summary list for a complete case', () => {
      const translations = {
        ...commonJson,
        ...applicationTypeJson,
        ...respondToTribunalCyaJson,
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
        document_binary_url: 'test-binary-url',
        document_size: 1024,
        document_mime_type: 'application/pdf',
        document_filename: 'test-file.pdf',
        document_url: 'test-url',
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
                href: '/respond-to-tribunal/1?lng=en',
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
            html: 'link',
          },
          actions: {
            items: [
              {
                href: '/respond-to-tribunal-supporting-material?lng=en',
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
                href: '/respond-to-tribunal-copy-to-other-party?lng=en',
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
                href: '/respond-to-tribunal-copy-to-other-party?lng=en',
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

  describe('clearTempFields', () => {
    it('should clear all temporary fields from userCase', () => {
      const userCase = {
        id: 'case123',
        responseText: 'test',
        hasSupportingMaterial: YesOrNo.YES,
        supportingMaterialFile: {
          document_url: '12345',
          document_filename: 'test.pdf',
          document_binary_url: '',
          document_size: 1000,
          document_mime_type: 'pdf',
        },
        copyToOtherPartyYesOrNo: YesOrNo.NO,
        copyToOtherPartyText: 'No reason',
      } as CaseWithId;

      clearTempFields(userCase);

      expect(userCase.responseText).toBeUndefined();
      expect(userCase.hasSupportingMaterial).toBeUndefined();
      expect(userCase.supportingMaterialFile).toBeUndefined();
      expect(userCase.copyToOtherPartyYesOrNo).toBeUndefined();
      expect(userCase.copyToOtherPartyText).toBeUndefined();
    });
  });
});
