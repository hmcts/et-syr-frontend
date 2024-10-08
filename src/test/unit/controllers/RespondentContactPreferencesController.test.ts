import RespondentContactPreferencesController from '../../../main/controllers/RespondentContactPreferencesController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { EmailOrPost, EnglishOrWelsh } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import { AnyRecord } from '../../../main/definitions/util-types';
import { postLogic } from '../../../main/helpers/CaseHelpers';
import { getPageContent } from '../../../main/helpers/FormHelper';
import { setUrlLanguage } from '../../../main/helpers/LanguageHelper';
import { getContactPreferencesDetails } from '../../../main/helpers/controller/RespondentContactPreferencesControllerHelper';
import { isOptionSelected } from '../../../main/validators/validator';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
jest.mock('../../../main/helpers/FormHelper');
jest.mock('../../../main/helpers/LanguageHelper');
jest.mock('../../../main/helpers/controller/RespondentContactPreferencesControllerHelper');
jest.mock('../../../main/validators/validator');

describe('RespondentContactPreferencesController', () => {
  let controller: RespondentContactPreferencesController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;
  let contentMock: AnyRecord;

  beforeEach(() => {
    controller = new RespondentContactPreferencesController();
    response = mockResponse();
    request = mockRequest({
      session: {
        userCase: {},
      },
      t: jest.fn(key => key), // Mocking translation function
    });

    // Mock getContactPreferencesDetails to return expected data
    (getContactPreferencesDetails as jest.Mock).mockReturnValue({
      someDetail: 'someValue', // replace with actual structure
    });

    // Mocks for getPageContent and setUrlLanguage
    contentMock = {
      form: {
        fields: {
          respondentContactPreference: {
            id: 'respondentContactPreference',
            name: 'respondentContactPreference',
            type: 'radios',
            label: 'What is your contact preference?',
            classes: 'govuk-radios',
            values: [
              {
                name: 'respondentContactPreference',
                label: 'Email',
                value: EmailOrPost.EMAIL,
              },
              {
                name: 'respondentContactPreference',
                label: 'Post',
                value: EmailOrPost.POST,
                subFields: {
                  respondentContactPreferenceDetail: {
                    id: 'respondentContactPreferenceDetail',
                    name: 'respondentContactPreferenceDetail',
                    type: 'text',
                    label: 'Details about post',
                    hint: 'Please provide details',
                    classes: 'govuk-text',
                  },
                },
              },
            ],
            validator: isOptionSelected,
          },
          respondentLanguagePreference: {
            id: 'respondentLanguagePreference',
            name: 'respondentLanguagePreference',
            type: 'radios',
            label: 'Preferred language',
            classes: 'govuk-radios--inline',
            values: [
              {
                name: 'respondentLanguagePreference',
                label: 'English',
                value: EnglishOrWelsh.ENGLISH,
              },
              {
                name: 'respondentLanguagePreference',
                label: 'Welsh',
                value: EnglishOrWelsh.WELSH,
              },
            ],
            validator: isOptionSelected,
          },
        },
      },
      submit: submitButton,
      saveForLater: saveForLaterButton,
    };

    (setUrlLanguage as jest.Mock).mockReturnValue(PageUrls.RESPONDENT_CONTACT_PREFERENCES);
    (getPageContent as jest.Mock).mockReturnValue(contentMock);
  });

  describe('GET method', () => {
    it('should render the Respondent Contact Preferences page with the correct form content and labels', () => {
      controller.get(request as unknown as AppRequest, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.RESPONDENT_CONTACT_PREFERENCES,
        expect.objectContaining({
          form: contentMock.form,
          redirectUrl: PageUrls.RESPONDENT_CONTACT_PREFERENCES,
          hideContactUs: true,
          contactPreferencesRespondentSection: {
            someDetail: 'someValue', // ensure this matches your mock return value
          },
        })
      );

      // Verify labels
      const renderMock = response.render as jest.Mock;
      const form = renderMock.mock.calls[0][1].form;

      expect(form.fields.respondentContactPreference.label).toBe('What is your contact preference?');
      expect(form.fields.respondentContactPreference.values[0].label).toBe('Email');
      expect(form.fields.respondentContactPreference.values[1].label).toBe('Post');
      expect(form.fields.respondentContactPreference.values[1].subFields.respondentContactPreferenceDetail.label).toBe(
        'Details about post'
      );
      expect(form.fields.respondentLanguagePreference.label).toBe('Preferred language');
      expect(form.fields.respondentLanguagePreference.values[0].label).toBe('English');
      expect(form.fields.respondentLanguagePreference.values[1].label).toBe('Welsh');
    });
  });

  describe('RespondentContactPreferencesController - Label Test', () => {
    beforeEach(() => {
      controller = new RespondentContactPreferencesController();
      response = mockResponse();
      request = mockRequest({
        session: {
          userCase: {},
        },
        t: jest.fn(key => key), // Mocking translation function
      });

      contentMock = {
        form: {
          fields: {
            respondentContactPreference: {
              id: 'respondentContactPreference',
              name: 'respondentContactPreference',
              type: 'radios',
              label: 'What is your contact preference?',
              classes: 'govuk-radios',
              values: [
                {
                  name: 'respondentContactPreference',
                  label: 'Email',
                  value: EmailOrPost.EMAIL,
                },
                {
                  name: 'respondentContactPreference',
                  label: 'Post',
                  value: EmailOrPost.POST,
                  subFields: {
                    respondentContactPreferenceDetail: {
                      id: 'respondentContactPreferenceDetail',
                      name: 'respondentContactPreferenceDetail',
                      type: 'text',
                      label: 'Details about post',
                      hint: 'Please provide details',
                      classes: 'govuk-text',
                    },
                  },
                },
              ],
              validator: isOptionSelected,
            },
            respondentLanguagePreference: {
              id: 'respondentLanguagePreference',
              name: 'respondentLanguagePreference',
              type: 'radios',
              label: 'Preferred language',
              classes: 'govuk-radios--inline',
              values: [
                {
                  name: 'respondentLanguagePreference',
                  label: 'English',
                  value: EnglishOrWelsh.ENGLISH,
                },
                {
                  name: 'respondentLanguagePreference',
                  label: 'Welsh',
                  value: EnglishOrWelsh.WELSH,
                },
              ],
              validator: isOptionSelected,
            },
          },
        },
        submit: submitButton,
        saveForLater: saveForLaterButton,
      };

      (setUrlLanguage as jest.Mock).mockReturnValue(PageUrls.RESPONDENT_CONTACT_PREFERENCES);
      (getPageContent as jest.Mock).mockReturnValue(contentMock);
    });

    it('should have the correct labels for the form fields', () => {
      controller.get(request as unknown as AppRequest, response);

      const renderMock = response.render as jest.Mock;
      const form = renderMock.mock.calls[0][1].form;

      // Assert labels for respondentContactPreference
      expect(form.fields.respondentContactPreference.label).toBe('What is your contact preference?');
      expect(form.fields.respondentContactPreference.values[0].label).toBe('Email');
      expect(form.fields.respondentContactPreference.values[1].label).toBe('Post');
      expect(form.fields.respondentContactPreference.values[1].subFields.respondentContactPreferenceDetail.label).toBe(
        'Details about post'
      );

      // Assert labels for respondentLanguagePreference
      expect(form.fields.respondentLanguagePreference.label).toBe('Preferred language');
      expect(form.fields.respondentLanguagePreference.values[0].label).toBe('English');
      expect(form.fields.respondentLanguagePreference.values[1].label).toBe('Welsh');
    });
  });

  describe('POST method', () => {
    it('should call postLogic with the correct parameters', async () => {
      const postLogicMock = postLogic as jest.Mock;
      await controller.post(request as unknown as AppRequest, response);

      expect(postLogicMock).toHaveBeenCalledWith(
        request,
        response,
        expect.any(Object), // The form fields object
        expect.any(Object), // The logger
        PageUrls.CHECK_YOUR_ANSWERS_CONTACT_DETAILS
      );
    });
  });
});
