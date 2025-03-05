import AxiosInstance, { AxiosResponse } from 'axios';

import ContactTribunalSubmitController from '../../../main/controllers/ContactTribunalSubmitController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { YesOrNo } from '../../../main/definitions/case';
import { ErrorPages, PageUrls } from '../../../main/definitions/constants';
import { ET3CaseDetailsLinksStatuses } from '../../../main/definitions/links';
import { CaseApi, getCaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import mockUserCase from '../mocks/mockUserCase';

jest.mock('config');
const controller = new ContactTribunalSubmitController();

describe('Contact Tribunal Submit Controller', () => {
  jest.mock('axios');
  const mockCaseApi = {
    axios: AxiosInstance,
    submitRespondentTse: jest.fn(),
  };
  const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
  jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

  caseApi.submitRespondentTse = jest.fn().mockResolvedValue(
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

  const updateCaseDetailsLinkStatuses = jest.spyOn(ET3Util, 'updateCaseDetailsLinkStatuses');
  updateCaseDetailsLinkStatuses.mockResolvedValueOnce(Promise.resolve(mockCaseWithIdWithRespondents));

  beforeEach(() => {});

  it('should redirect to CONTACT_TRIBUNAL_SUBMIT_COMPLETE with language param', async () => {
    const res = mockResponse();
    const req = mockRequest({});
    req.session.userCase = mockUserCase;
    req.session.userCase.et3CaseDetailsLinksStatuses = new ET3CaseDetailsLinksStatuses();
    req.url = PageUrls.CONTACT_TRIBUNAL_SUBMIT_COMPLETE;

    await controller.get(req, res);
    expect(req.session.userCase.ruleCopyState).toBe(true);
    expect(req.session.userCase.copyToOtherPartyYesOrNo).toBe(undefined);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CONTACT_TRIBUNAL_SUBMIT_COMPLETE + '?lng=en');
  });

  it('should redirect to NOT_FOUND on error during submission', async () => {
    const res = mockResponse();
    const req = mockRequest({});
    req.session.userCase = mockUserCase;
    req.url = PageUrls.CONTACT_TRIBUNAL_SUBMIT_COMPLETE;
    req.session.userCase.copyToOtherPartyYesOrNo = YesOrNo.YES;
    req.session.userCase.selectedGenericTseApplication.value.applicantIdamId = '123';
    req.url = '/test-url';
    jest.spyOn(getCaseApi(req.session.user?.accessToken), 'submitRespondentTse').mockImplementation(() => {
      throw new Error('Test error');
    });
    await controller.get(req, res);
    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });

  it('should handle missing userCase in session gracefully', async () => {
    const res = mockResponse();
    const req = mockRequest({});
    req.session.userCase = undefined;
    req.url = PageUrls.CONTACT_TRIBUNAL_SUBMIT_COMPLETE;

    await controller.get(req, res);
    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });
});
