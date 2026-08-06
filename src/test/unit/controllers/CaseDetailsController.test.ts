import axios from 'axios';

import CaseDetailsController from '../../../main/controllers/CaseDetailsController';
import { CaseType } from '../../../main/definitions/case';
import { TranslationKeys } from '../../../main/definitions/constants';
import * as caseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';

jest.mock('axios');

describe('Case list controller', () => {
  const t = {
    common: {},
  };
  const getCaseApiMock = jest.spyOn(caseService, 'getCaseApi');
  const api = new CaseApi(axios);
  const caseDetailsController = new CaseDetailsController();
  const response = mockResponse();
  const request = mockRequest({ t });
  it('should render respondent replies page', async () => {
    getCaseApiMock.mockReturnValue(api);
    const multipleCaseApiResponse = {
      ...MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse,
      data: {
        ...MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse.data,
        case_data: {
          ...MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse.data.case_data,
          caseType: CaseType.MULTIPLE,
        },
      },
    };
    api.getUserCase = jest.fn().mockResolvedValueOnce(Promise.resolve(multipleCaseApiResponse));
    request.session.user = mockUserDetails;
    request.session.user.id = 'dda9d1c3-1a11-3c3a-819e-74174fbec26b';
    request.session.selectedRespondentIndex = 0;
    request.params = { ccdId: 'test' };
    await caseDetailsController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER,
      expect.objectContaining({
        isGroupClaim: true,
      })
    );
  });
});
