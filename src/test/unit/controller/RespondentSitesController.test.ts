import RespondentSitesController from '../../../main/controllers/RespondentSitesController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { postLogic } from '../../../main/helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../../../main/helpers/FormHelper';
import { setUrlLanguage } from '../../../main/helpers/LanguageHelper';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
jest.mock('../../../main/helpers/FormHelper');
jest.mock('../../../main/helpers/LanguageHelper');

describe('RespondentSitesController', () => {
  let controller: RespondentSitesController;
  let req: ReturnType<typeof mockRequest>;
  let res: ReturnType<typeof mockResponse>;
  let formMock: any;

  beforeEach(() => {
    controller = new RespondentSitesController();
    req = mockRequest({
      session: {
        userCase: {},
      },
    });
    res = mockResponse();
    formMock = {
      fields: {
        respondentSites: {
          classes: 'govuk-radios',
          id: 'respondentSites',
          type: 'text',
          hint: 'This is the hint',
        },
      },
      submit: 'submit button',
      saveForLater: 'save for later button',
    };

    (getPageContent as jest.Mock).mockReturnValue(formMock);
    (setUrlLanguage as jest.Mock).mockReturnValue(PageUrls.RESPONDENT_SITES);
  });

  describe('GET method', () => {
    it('should render the Respondent Sites page with the correct form content', () => {
      controller.get(req as unknown as AppRequest, res);

      expect(getPageContent).toHaveBeenCalledWith(req, controller['respondentSites'], [
        TranslationKeys.COMMON,
        TranslationKeys.RESPONDENT_SITES,
        TranslationKeys.SIDEBAR_CONTACT_US,
      ]);

      expect(assignFormData).toHaveBeenCalledWith(req.session.userCase, expect.any(Object));

      expect(res.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_SITES, {
        ...formMock,
        redirectUrl: PageUrls.RESPONDENT_SITES,
        hideContactUs: true,
      });
    });

    it('should call setUrlLanguage with correct arguments', () => {
      controller.get(req as unknown as AppRequest, res);

      expect(setUrlLanguage).toHaveBeenCalledWith(req, PageUrls.RESPONDENT_SITES);
    });
  });

  describe('POST method', () => {
    it('should call postLogic with the correct parameters', async () => {
      await controller.post(req as unknown as AppRequest, res);

      expect(postLogic).toHaveBeenCalledWith(
        req,
        res,
        controller['form'],
        expect.anything(),
        PageUrls.RESPONDENT_SITE_EMPLOYEES
      );
    });
  });
});
