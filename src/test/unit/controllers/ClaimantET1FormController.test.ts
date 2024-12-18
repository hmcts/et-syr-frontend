import axios from 'axios';
import _ from 'lodash';

import ClaimantET1FormController from '../../../main/controllers/ClaimantET1FormController';
import { ApiDocumentTypeItem } from '../../../main/definitions/complexTypes/documentTypeItem';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { setUrlLanguage } from '../../../main/helpers/LanguageHelper';
import { getLanguageParam } from '../../../main/helpers/RouterHelpers';
import { getFlagValue } from '../../../main/modules/featureFlag/launchDarkly';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import {
  mockedAcasFormDocumentApiModel,
  mockedET1FormEnglishDocumentApiModel,
  mockedET1FormWelshDocumentApiModel,
} from '../mocks/mockDocumentApiModel';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/LanguageHelper');
jest.mock('../../../main/modules/featureFlag/launchDarkly');
jest.mock('../../../main/helpers/RouterHelpers');

describe('Claimant ET1 Form Controller', () => {
  let controller: ClaimantET1FormController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ClaimantET1FormController();
    request = mockRequest({});
    response = mockResponse();

    // Mocking external dependencies
    (setUrlLanguage as jest.Mock).mockReturnValue(PageUrls.CLAIMANT_ET1_FORM);
    (getFlagValue as jest.Mock).mockResolvedValue(true); // Assume Welsh is enabled for the test
    (getLanguageParam as jest.Mock).mockReturnValue('en');
  });

  describe('GET method', () => {
    const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
    const api = new CaseApi(axios);
    it('should call res.render with the correct parameters', async () => {
      // Call the controller's GET method
      getCaseApiMock.mockReturnValue(api);
      api.getUserCase = jest
        .fn()
        .mockResolvedValueOnce(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse));
      await controller.get(request, response);

      // Expect that res.render was called with the right template and object
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CLAIMANT_ET1_FORM,
        expect.objectContaining({
          PageUrls,
          hideContactUs: true,
          useCase: request.session.userCase,
          redirectUrl: PageUrls.CLAIMANT_ET1_FORM,
          languageParam: 'en',
          welshEnabled: true,
        })
      );
    });

    it('should set acas certificate and both english and welsh et1forms to session and res.render is called with mockedET1FormEnglish', async () => {
      const mockedAxiosResponse = _.cloneDeep(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse);
      mockedAxiosResponse.data.case_data.documentCollection = [
        mockedET1FormEnglishDocumentApiModel,
        mockedET1FormWelshDocumentApiModel,
        mockedAcasFormDocumentApiModel,
      ];
      mockedAxiosResponse.data.case_data.respondentCollection = [
        {
          id: 'xxx',
          value: {
            respondent_ACAS: 'R123456/78/90',
          },
        },
      ];
      getCaseApiMock.mockReturnValue(api);
      api.getUserCase = jest.fn().mockResolvedValueOnce(Promise.resolve(mockedAxiosResponse));
      request.session.userCase.acasCertNum = 'R123456_78_90';
      request.session.selectedRespondentIndex = 0;
      await controller.get(request, response);
      // Expect that res.render was called with the right template and object
      expect(request.session.et1FormWelsh).toStrictEqual(mockedET1FormWelshDocumentApiModel as ApiDocumentTypeItem);
      expect(request.session.et1FormEnglish).toStrictEqual(mockedET1FormEnglishDocumentApiModel as ApiDocumentTypeItem);
      expect(request.session.selectedAcasCertificate).toStrictEqual(
        mockedAcasFormDocumentApiModel as ApiDocumentTypeItem
      );
      expect(response.render).toHaveBeenCalled();
    });
  });
});
