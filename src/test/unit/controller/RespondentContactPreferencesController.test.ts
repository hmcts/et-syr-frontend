import RespondentContactPreferencesController from '../../../main/controllers/RespondentContactPreferencesController';
import { EmailOrPost, EnglishOrWelsh } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import { isFieldFilledIn, isOptionSelected } from '../../../main/validators/validator';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('RespondentContactPreferencesController', () => {
  let controller: RespondentContactPreferencesController;
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondentContactPreferencesController();
    req = mockRequest({
      session: {
        userCase: {},
      },
    });
    res = mockResponse();
  });

  describe('GET', () => {
    it('should render the Respondent Contact Preferences page with the correct form content', async () => {
      // Mock translations
      (req.t as unknown as jest.Mock).mockReturnValue({
        contactPreferenceQuestion: 'How do you prefer to be contacted?',
        email: 'Email',
        post: 'Post',
        postHintText: 'You will receive all correspondence by post.',
        english: 'English',
        cymraeg: 'Welsh',
      });

      await controller.get(req, res);

      expect(res.render).toHaveBeenCalledWith(
        TranslationKeys.RESPONDENT_CONTACT_PREFERENCES,
        expect.objectContaining({
          PageUrls,
          hideContactUs: true,
          form: expect.objectContaining({
            fields: {
              respondentContactPreference: expect.objectContaining({
                id: 'respondentContactPreference',
                type: 'radios',
                label: expect.any(Function),
                values: [
                  {
                    name: 'respondentContactPreference',
                    label: expect.any(Function),
                    value: EmailOrPost.EMAIL,
                  },
                  {
                    name: 'respondentContactPreference',
                    label: expect.any(Function),
                    value: EmailOrPost.POST,
                    subFields: expect.objectContaining({
                      respondentContactPreferenceDetail: expect.objectContaining({
                        id: 'respondentContactPreferenceDetail',
                        name: 'respondentContactPreferenceDetail',
                        type: 'text',
                        classes: 'govuk-text',
                        hint: expect.any(Function),
                        validator: isFieldFilledIn,
                      }),
                    }),
                  },
                ],
                validator: isOptionSelected,
              }),
              respondentLanguagePreference: expect.objectContaining({
                id: 'respondentLanguagePreference',
                type: 'radios',
                label: expect.any(Function),
                values: [
                  {
                    name: 'respondentLanguagePreference',
                    label: expect.any(Function),
                    value: EnglishOrWelsh.ENGLISH,
                  },
                  {
                    name: 'respondentLanguagePreference',
                    label: expect.any(Function),
                    value: EnglishOrWelsh.WELSH,
                  },
                ],
                validator: isOptionSelected,
              }),
            },
            submit: submitButton,
            saveForLater: saveForLaterButton,
          }),
          userCase: req.session?.userCase,
          redirectUrl: expect.any(String),
          languageParam: expect.any(String),
          sessionErrors: req.session.errors,
        })
      );

      // Check contact preference labels
      const renderMock = res.render as jest.Mock;
      const formContent = renderMock.mock.calls[0][1].form;

      // Check that the form label function returns the correct value for the contact preference field
      expect(
        formContent.fields.respondentContactPreference.label({
          contactPreferenceQuestion: 'How do you prefer to be contacted?',
        })
      ).toBe('How do you prefer to be contacted?');

      // Check email label
      expect(
        formContent.fields.respondentContactPreference.values[0].label({
          email: 'Email',
        })
      ).toBe('Email');

      // Check post label
      expect(
        formContent.fields.respondentContactPreference.values[1].label({
          post: 'Post',
        })
      ).toBe('Post');

      // Check hint for post subfield
      expect(
        formContent.fields.respondentContactPreference.values[1].subFields.respondentContactPreferenceDetail.hint({
          postHintText: 'You will receive all correspondence by post.',
        })
      ).toBe('You will receive all correspondence by post.');

      // Check language preference labels
      expect(
        formContent.fields.respondentLanguagePreference.label({
          contactPreferenceQuestion: 'How do you prefer to be contacted?',
        })
      ).toBe('How do you prefer to be contacted?');

      // Check English label
      expect(
        formContent.fields.respondentLanguagePreference.values[0].label({
          english: 'English',
        })
      ).toBe('English');

      // Check Welsh label
      expect(
        formContent.fields.respondentLanguagePreference.values[1].label({
          cymraeg: 'Welsh',
        })
      ).toBe('Welsh');
    });
  });

  describe('POST', () => {
    it('should redirect to the NOT_IMPLEMENTED page when form submission is valid', async () => {
      req.body = {
        respondentContactPreference: EmailOrPost.EMAIL, // Simulate valid inputs
        respondentLanguagePreference: EnglishOrWelsh.ENGLISH,
      };

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.NOT_IMPLEMENTED);
    });

    it('should redirect back to the same page when there are validation errors', async () => {
      req.body = {
        respondentContactPreference: '', // Simulate invalid input
      };

      await controller.post(req, res);

      expect(req.session.errors).toBeDefined();
      expect(res.redirect).toHaveBeenCalledWith(req.url);
    });
  });
});
