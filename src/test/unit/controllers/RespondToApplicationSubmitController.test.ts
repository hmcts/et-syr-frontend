import AxiosInstance, { AxiosResponse } from 'axios';

import RespondToApplicationSubmitController from '../../../main/controllers/RespondToApplicationSubmitController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { YesOrNo } from '../../../main/definitions/case';
import { ErrorPages, PageUrls } from '../../../main/definitions/constants';
import { CaseApi, getCaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

jest.mock('config');
const controller = new RespondToApplicationSubmitController();

describe('Respond To Application Submit Controller', () => {
  jest.mock('axios');
  const mockCaseApi = {
    axios: AxiosInstance,
    submitRespondentResponseToApplication: jest.fn(),
  };
  const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
  jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

  caseApi.submitRespondentResponseToApplication = jest.fn().mockResolvedValue(
    Promise.resolve({
      data: {
        id: '135',
        created_date: '2022-08-19T09:19:25.79202',
        last_modified: '2022-08-19T09:19:25.817549',
        case_data: {
          tseApplicationStoredCollection: [
            {
              id: '246',
              value: {
                applicant: 'Claimant',
              },
            },
          ],
        },
      },
    } as AxiosResponse<CaseApiDataResponse>)
  );

  beforeEach(() => {});

  it('should redirect to RESPOND_TO_APPLICATION_COMPLETE with language param', async () => {
    const res = mockResponse();
    const req = mockRequest({});
    req.session.userCase = mockUserCase;
    req.url = PageUrls.RESPOND_TO_APPLICATION_COMPLETE;

    await controller.get(req, res);
    expect(req.session.userCase.ruleCopystate).toBe(true);
    expect(req.session.userCase.copyToOtherPartyYesOrNo).toBe(undefined);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RESPOND_TO_APPLICATION_COMPLETE + '?lng=en');
  });

  it('should redirect to NOT_FOUND on error during submission', async () => {
    const res = mockResponse();
    const req = mockRequest({});
    req.session.userCase = mockUserCase;
    req.url = PageUrls.RESPOND_TO_APPLICATION_COMPLETE;
    req.session.userCase.copyToOtherPartyYesOrNo = YesOrNo.YES;
    req.url = '/test-url';
    jest.spyOn(getCaseApi(req.session.user?.accessToken), 'submitRespondentResponseToApplication').mockImplementation(() => {
      throw new Error('Test error');
    });
    await controller.get(req, res);
    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });

  it('should handle missing userCase in session gracefully', async () => {
    const res = mockResponse();
    const req = mockRequest({});
    req.session.userCase = undefined;
    req.url = PageUrls.RESPOND_TO_APPLICATION_COMPLETE;

    await controller.get(req, res);
    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });
});
