import RespondentEmployeesController from '../../../main/controllers/RespondentEmployeesController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { ET3HubLinkNames, LinkStatus } from '../../../main/definitions/links';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import pageJsonRaw from '../../../main/resources/locales/en/translation/respondent-employees.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/utils/ET3Util');

describe('RespondentEmployeesController', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: RespondentEmployeesController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new RespondentEmployeesController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page with the correct translations', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.RESPONDENT_EMPLOYEES, expect.anything());
    });
  });

  describe('POST method', () => {
    it('should call ET3Util.updateET3ResponseWithET3Form with the correct parameters', async () => {
      request = mockRequest({
        body: {
          et3ResponseEmploymentCount: '50',
        },
      });
      request.url = PageUrls.RESPONDENT_EMPLOYEES;

      await controller.post(request, response);

      expect(ET3Util.updateET3ResponseWithET3Form).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(), // Form object
        ET3HubLinkNames.EmployerDetails,
        LinkStatus.IN_PROGRESS,
        PageUrls.RESPONDENT_SITES
      );
    });
  });
});
