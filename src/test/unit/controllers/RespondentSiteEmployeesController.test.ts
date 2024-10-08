import RespondentSiteEmployeesController from '../../../main/controllers/RespondentSiteEmployeesController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import { AnyRecord } from '../../../main/definitions/util-types';
import { postLogic } from '../../../main/helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../../../main/helpers/FormHelper';
import { setUrlLanguage } from '../../../main/helpers/LanguageHelper';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
jest.mock('../../../main/helpers/FormHelper');
jest.mock('../../../main/helpers/LanguageHelper');

describe('RespondentSiteEmployeesController', () => {
  let controller: RespondentSiteEmployeesController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;
  let contentMock: AnyRecord;

  beforeEach(() => {
    controller = new RespondentSiteEmployeesController();
    response = mockResponse();
    request = mockRequest({
      session: {
        userCase: {},
      },
    });

    // Mock necessary methods and content
    contentMock = {
      fields: {
        respondentSiteEmployees: {
          classes: 'govuk-text',
          id: 'respondentSiteEmployees',
          type: 'text',
          label: (l: AnyRecord): string => l.label,
          hint: (l: AnyRecord): string => l.hint,
          labelHidden: false,
        },
      },
      submit: submitButton,
      saveForLater: saveForLaterButton,
    };

    (getPageContent as jest.Mock).mockReturnValue(contentMock);
    (setUrlLanguage as jest.Mock).mockReturnValue(PageUrls.RESPONDENT_SITE_EMPLOYEES);
  });

  describe('GET method', () => {
    it('should render the Respondent Site Employees page with the correct form content', () => {
      controller.get(request as unknown as AppRequest, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.RESPONDENT_SITE_EMPLOYEES,
        expect.objectContaining({
          ...contentMock,
          redirectUrl: PageUrls.RESPONDENT_SITE_EMPLOYEES,
          hideContactUs: true,
        })
      );
    });

    it('should call assignFormData with the correct form fields', () => {
      controller.get(request as unknown as AppRequest, response);

      expect(assignFormData).toHaveBeenCalledWith(
        request.session.userCase,
        expect.objectContaining({
          respondentSiteEmployees: expect.any(Object),
        })
      );
    });

    it('should call setUrlLanguage with the correct arguments', () => {
      controller.get(request as unknown as AppRequest, response);

      expect(setUrlLanguage).toHaveBeenCalledWith(request, PageUrls.RESPONDENT_SITE_EMPLOYEES);
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
        PageUrls.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES
      );
    });
  });
});
