import HearingPreferencesController from '../../../main/controllers/HearingPreferencesController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { HearingPreference } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import { AnyRecord } from '../../../main/definitions/util-types';
import { postLogic } from '../../../main/helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../../../main/helpers/FormHelper';
import { setUrlLanguage } from '../../../main/helpers/LanguageHelper';
import { atLeastOneFieldIsChecked, isFieldFilledIn } from '../../../main/validators/validator';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
jest.mock('../../../main/helpers/FormHelper');
jest.mock('../../../main/helpers/LanguageHelper');
jest.mock('../../../main/validators/validator');

describe('HearingPreferencesController', () => {
  let controller: HearingPreferencesController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;
  let contentMock: AnyRecord;

  beforeEach(() => {
    controller = new HearingPreferencesController();
    response = mockResponse();
    request = mockRequest({
      session: {
        userCase: {},
      },
    });

    // Mocking necessary methods and content
    contentMock = {
      fields: {
        hearingPreferences: {
          id: 'hearingPreferences',
          label: (l: AnyRecord): string => l.legend,
          labelHidden: false,
          labelSize: 'l',
          type: 'checkboxes',
          hint: (l: AnyRecord): string => l.selectAllHint,
          validator: atLeastOneFieldIsChecked,
          values: [
            {
              name: 'hearingPreferences',
              label: (l: AnyRecord): string => l.checkboxVideo,
              value: HearingPreference.VIDEO,
            },
            {
              name: 'hearingPreferences',
              label: (l: AnyRecord): string => l.checkboxPhone,
              value: HearingPreference.PHONE,
            },
            {
              divider: true,
            },
            {
              name: 'hearingPreferences',
              label: (l: AnyRecord): string => l.checkboxNeither,
              exclusive: true,
              value: HearingPreference.NEITHER,
              subFields: {
                hearingAssistance: {
                  id: 'hearingAssistance',
                  type: 'textarea',
                  label: (l: AnyRecord): string => l.explain,
                  labelSize: 'normal',
                  attributes: {
                    maxLength: 2500,
                  },
                  validator: isFieldFilledIn,
                },
              },
            },
          ],
        },
      },
      submit: submitButton,
      saveForLater: saveForLaterButton,
    };

    (getPageContent as jest.Mock).mockReturnValue(contentMock);
    (setUrlLanguage as jest.Mock).mockReturnValue(PageUrls.HEARING_PREFERENCES);
  });

  describe('GET method', () => {
    it('should render the Hearing Preferences page with the correct form content', () => {
      controller.get(request as unknown as AppRequest, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.HEARING_PREFERENCES,
        expect.objectContaining({
          ...contentMock,
          redirectUrl: PageUrls.HEARING_PREFERENCES,
          hideContactUs: true,
        })
      );
    });

    it('should call assignFormData with the correct form fields', () => {
      controller.get(request as unknown as AppRequest, response);

      expect(assignFormData).toHaveBeenCalledWith(
        request.session.userCase,
        expect.objectContaining({
          hearingPreferences: expect.any(Object),
        })
      );
    });

    it('should call setUrlLanguage with the correct arguments', () => {
      controller.get(request as unknown as AppRequest, response);

      expect(setUrlLanguage).toHaveBeenCalledWith(request, PageUrls.HEARING_PREFERENCES);
    });
  });

  describe('POST method', () => {
    it('should call postLogic with the correct parameters', async () => {
      const postLogicMock = postLogic as jest.Mock;

      await controller.post(request as unknown as AppRequest, response);

      expect(postLogicMock).toHaveBeenCalledWith(
        request,
        response,
        expect.any(Object), // The form object
        expect.any(Object), // Logger
        PageUrls.NOT_IMPLEMENTED
      );
    });

    it('should use the atLeastOneFieldIsChecked validator for hearingPreferences field', async () => {
      const formFields = controller['form'].getFormFields();
      const hearingPreferencesField = formFields.hearingPreferences;

      expect(hearingPreferencesField.validator).toBe(atLeastOneFieldIsChecked);
    });
  });
});
