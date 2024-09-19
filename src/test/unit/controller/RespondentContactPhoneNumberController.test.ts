import RespondentContactPhoneNumberController from '../../../main/controllers/RespondentContactPhoneNumberController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import { postLogic } from '../../../main/helpers/CaseHelpers';
import { getPageContent } from '../../../main/helpers/FormHelper';
import { setUrlLanguage } from '../../../main/helpers/LanguageHelper';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
jest.mock('../../../main/helpers/FormHelper');
jest.mock('../../../main/helpers/LanguageHelper');
jest.mock('../../../main/validators/validator');

describe('RespondentContactPhoneNumberController', () => {
  let controller: RespondentContactPhoneNumberController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;
  let contentMock: any;

  beforeEach(() => {
    controller = new RespondentContactPhoneNumberController();
    response = mockResponse();
    request = mockRequest({
      session: {
        userCase: {},
      },
    });

    // Mocks for getPageContent and setUrlLanguage
    contentMock = {
      fields: {
        respondentContactPhoneNumber: {
          id: 'respondentContactPhoneNumber',
          name: 'respondentContactPhoneNumber',
          type: 'text',
          hint: 'Phone number',
          classes: 'govuk-text',
          attributes: { maxLength: 20 },
        },
      },
      submit: submitButton,
      saveForLater: saveForLaterButton,
    };

    (setUrlLanguage as jest.Mock).mockReturnValue(PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER);
    (getPageContent as jest.Mock).mockReturnValue(contentMock);
  });

  describe('GET method', () => {
    it('should render the Respondent Contact Phone Number page with the correct form content', () => {
      controller.get(request as unknown as AppRequest, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.RESPONDENT_CONTACT_PHONE_NUMBER,
        expect.objectContaining({
          ...contentMock,
          redirectUrl: PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER,
          hideContactUs: true,
        })
      );
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
        PageUrls.RESPONDENT_CONTACT_PREFERENCES
      );
    });
  });
});
