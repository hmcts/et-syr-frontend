import _ from 'lodash';

import YourResponseFormController from '../../../main/controllers/YourResponseFormController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { CLAIM_TYPES, TranslationKeys } from '../../../main/definitions/constants';
import {
  getEt3Section1,
  getEt3Section2,
  getEt3Section3,
  getEt3Section4,
  getEt3Section5,
  getEt3Section6,
} from '../../../main/helpers/controller/CheckYourAnswersET3Helper';
import { getFlagValue } from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockRespondentET3Model } from '../mocks/mockRespondentET3Model';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

jest.mock('../../../main/helpers/controller/CheckYourAnswersET3Helper');
jest.mock('../../../main/modules/featureFlag/launchDarkly');

describe('YourResponseFormController tests', () => {
  let controller: YourResponseFormController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;
  const userCase = {}; // mock userCase object as needed

  beforeEach(() => {
    controller = new YourResponseFormController();
    request = mockRequest({
      session: {
        userCase,
      },
    });
    response = mockResponse();
    jest.clearAllMocks();
  });

  describe('GET method', (): void => {
    const testWelshUrl: string = 'http://localhost:3000?lng=cy';
    const testEnglishUrl: string = 'http://localhost:3000?lng=en';
    const formDocumentWelsh = {
      category_id: 'category_id_welsh',
      document_binary_url: 'document_binary_url_welsh',
      document_filename: 'document_filename_welsh',
      upload_timestamp: 'upload_timestamp_welsh',
      document_url: 'http://localhost/et3_form_id_welsh',
    };
    const formDocumentEnglish = {
      category_id: 'category_id_english',
      document_binary_url: 'document_binary_url_english',
      document_filename: 'document_filename_english',
      upload_timestamp: 'upload_timestamp_english',
      document_url: 'http://localhost/et3_form_id_english',
    };
    const req: AppRequest = mockRequest({});
    (getFlagValue as jest.Mock).mockResolvedValue(true);
    (req.t as unknown as jest.Mock).mockReturnValueOnce({});
    req.session.userCase = _.cloneDeep(mockUserCase);
    req.session.userCase.respondents = [mockRespondentET3Model];
    req.session.selectedRespondentIndex = 0;
    req.session.userCase.respondents[0].et3Form = formDocumentEnglish;
    req.session.userCase.respondents[0].et3FormWelsh = formDocumentWelsh;
    const et3FormIdWelsh = 'et3_form_id_welsh';
    const et3FormIdEnglish = 'et3_form_id_english';
    const mockSections = (): void => {
      (getEt3Section6 as jest.Mock).mockReturnValue('mocked section 6 data');
      (getEt3Section5 as jest.Mock).mockReturnValue('mocked section 5 data');
      (getEt3Section4 as jest.Mock).mockReturnValue('mocked section 4 data');
      (getEt3Section3 as jest.Mock).mockReturnValue('mocked section 3 data');
      (getEt3Section2 as jest.Mock).mockReturnValue('mocked section 2 data');
      (getEt3Section1 as jest.Mock).mockReturnValue('mocked section 1 data');
    };
    it('should render the your response form page with the correct translations and data', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      (request.t as unknown as jest.Mock).mockReturnValueOnce({});
      mockSections();
      request.session.userCase.typeOfClaim = [CLAIM_TYPES.DISCRIMINATION];
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.YOUR_RESPONSE_FORM,
        expect.objectContaining({
          et3ResponseSection1: 'mocked section 1 data',
          et3ResponseSection2: 'mocked section 2 data',
          et3ResponseSection3: 'mocked section 3 data',
          et3ResponseSection4: 'mocked section 4 data',
          et3ResponseSection5: 'mocked section 5 data',
          redirectUrl: expect.any(String),
          welshEnabled: true,
        })
      );
    });
    it('should render the your response form page with welsh et3 form id', async () => {
      req.url = testWelshUrl;
      mockSections();
      await controller.get(req, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.YOUR_RESPONSE_FORM,
        expect.objectContaining({
          et3ResponseSection1: 'mocked section 1 data',
          et3ResponseSection2: 'mocked section 2 data',
          et3ResponseSection3: 'mocked section 3 data',
          et3ResponseSection4: 'mocked section 4 data',
          et3ResponseSection5: 'mocked section 5 data',
          redirectUrl: expect.any(String),
          welshEnabled: true,
          et3FormId: et3FormIdWelsh,
        })
      );
    });
    it('should render the your response form page with english et3 form id', async () => {
      req.url = testEnglishUrl;
      mockSections();
      await controller.get(req, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.YOUR_RESPONSE_FORM,
        expect.objectContaining({
          et3ResponseSection1: 'mocked section 1 data',
          et3ResponseSection2: 'mocked section 2 data',
          et3ResponseSection3: 'mocked section 3 data',
          et3ResponseSection4: 'mocked section 4 data',
          et3ResponseSection5: 'mocked section 5 data',
          redirectUrl: expect.any(String),
          welshEnabled: true,
          et3FormId: et3FormIdEnglish,
          isSection6Visible: false,
        })
      );
    });
    it('should render the your response with section 6', async () => {
      (getFlagValue as jest.Mock).mockResolvedValue(true);
      (request.t as unknown as jest.Mock).mockReturnValueOnce({});
      request.session.userCase.typeOfClaim = [CLAIM_TYPES.BREACH_OF_CONTRACT];
      mockSections();
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.YOUR_RESPONSE_FORM,
        expect.objectContaining({
          et3ResponseSection1: 'mocked section 1 data',
          et3ResponseSection2: 'mocked section 2 data',
          et3ResponseSection3: 'mocked section 3 data',
          et3ResponseSection4: 'mocked section 4 data',
          et3ResponseSection5: 'mocked section 5 data',
          et3ResponseSection6: 'mocked section 6 data',
          redirectUrl: expect.any(String),
          welshEnabled: true,
          isSection6Visible: true,
        })
      );
    });
  });
});
