import AxiosInstance from 'axios';

import ContactTribunalStoreController from '../../../main/controllers/ContactTribunalStoreController';
import { YesOrNo } from '../../../main/definitions/case';
import { Applicant, ErrorPages, PageUrls } from '../../../main/definitions/constants';
import { ET3CaseDetailsLinksStatuses } from '../../../main/definitions/links';
import { CaseApi, getCaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import ET3Util from '../../../main/utils/ET3Util';
import { MockAxiosResponses } from '../mocks/mockAxiosResponses';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { mockUserDetails } from '../mocks/mockUser';
import mockUserCase from '../mocks/mockUserCase';

jest.mock('config');
const controller = new ContactTribunalStoreController();

describe('Contact Tribunal Store Controller', () => {
  jest.mock('axios');
  const mockCaseApi = {
    axios: AxiosInstance,
    storeRespondentTse: jest.fn(),
  };
  const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
  jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);
  caseApi.storeRespondentTse = jest
    .fn()
    .mockResolvedValue(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse));
  caseApi.changeApplicationStatus = jest
    .fn()
    .mockResolvedValue(Promise.resolve(MockAxiosResponses.mockAxiosResponseWithCaseApiDataResponse));

  const mockCaseWithId = mockCaseWithIdWithRespondents;
  mockCaseWithId.genericTseApplicationCollection = [
    {
      id: '246',
      value: {
        applicant: Applicant.RESPONDENT,
        applicantIdamId: '1234',
      },
    },
  ];
  jest.spyOn(ET3Util, 'updateCaseDetailsLinkStatuses').mockResolvedValueOnce(Promise.resolve(mockCaseWithId));

  beforeEach(() => {});

  it('should redirect to CONTACT_TRIBUNAL_STORE_COMPLETE with language param', async () => {
    const res = mockResponse();
    const req = mockRequest({});
    req.session.user = mockUserDetails;
    req.session.userCase = mockUserCase;
    req.session.userCase.et3CaseDetailsLinksStatuses = new ET3CaseDetailsLinksStatuses();
    req.url = PageUrls.CONTACT_TRIBUNAL_STORE_COMPLETE;

    await controller.get(req, res);
    expect(req.session.userCase.copyToOtherPartyYesOrNo).toBe(undefined);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CONTACT_TRIBUNAL_STORE_COMPLETE + '?lng=en');
  });

  it('should redirect to NOT_FOUND on error during submission', async () => {
    const res = mockResponse();
    const req = mockRequest({});
    req.session.userCase = mockUserCase;
    req.url = PageUrls.CONTACT_TRIBUNAL_STORE_COMPLETE;
    req.session.userCase.copyToOtherPartyYesOrNo = YesOrNo.YES;
    req.url = '/test-url';
    jest.spyOn(getCaseApi(req.session.user?.accessToken), 'storeRespondentTse').mockImplementation(() => {
      throw new Error('Test error');
    });
    await controller.get(req, res);
    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });

  it('should handle missing userCase in session gracefully', async () => {
    const res = mockResponse();
    const req = mockRequest({});
    req.session.userCase = undefined;
    req.url = PageUrls.CONTACT_TRIBUNAL_STORE_COMPLETE;

    await controller.get(req, res);
    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });
});
