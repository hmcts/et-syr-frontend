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
    api.getUserCase = jest
      .fn()
      .mockResolvedValueOnce(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse));
    request.session.user = mockUserDetails;
    request.session.user.id = 'dda9d1c3-1a11-3c3a-819e-74174fbec26b';
    request.session.selectedRespondentIndex = 0;
    request.params = { ccdId: 'test' };
    await caseDetailsController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER,
      expect.anything()
    );
  });

  it('should set session.multipleCase for a multiple claim using mapped API response', async () => {
    getCaseApiMock.mockReturnValue(api);
    api.getUserCase = jest.fn().mockResolvedValueOnce(
      Promise.resolve({
        ...MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse,
        data: {
          ...MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse.data,
          case_data: {
            ...MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse.data.case_data,
            caseType: CaseType.MULTIPLE,
            parentMultipleCaseId: '1111222233334444',
          },
        },
      })
    );
    api.getMultipleCase = jest.fn().mockResolvedValueOnce(
      Promise.resolve({
        data: {
          id: '1111222233334444',
          case_data: {
            multipleName: 'Test Multiple',
            multipleReference: '6000001/2026',
            claimantContactDetailsDocument: {
              document_url: 'http://doc/url',
              document_filename: 'contacts.pdf',
              document_binary_url: 'http://doc/binary',
            },
          },
        },
      })
    );

    request.session.user = mockUserDetails;
    request.session.user.id = 'dda9d1c3-1a11-3c3a-819e-74174fbec26b';
    request.session.selectedRespondentIndex = 0;
    request.params = { caseSubmissionReference: '1234567890123456' };

    await caseDetailsController.get(request, response);

    expect(api.getMultipleCase).toHaveBeenCalledWith('1111222233334444');
    expect(request.session.multipleCase).toEqual({
      id: '1111222233334444',
      multipleName: 'Test Multiple',
      multipleReference: '6000001/2026',
      claimantContactDetailsDocument: {
        document_url: 'http://doc/url',
        document_filename: 'contacts.pdf',
        document_binary_url: 'http://doc/binary',
      },
    });
  });
});
