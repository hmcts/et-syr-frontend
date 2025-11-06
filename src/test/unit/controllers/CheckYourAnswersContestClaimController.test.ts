import _ from 'lodash';

import CheckYourAnswersContestClaimController from '../../../main/controllers/CheckYourAnswersContestClaimController';
import { CLAIM_TYPES, PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { LinkStatus } from '../../../main/definitions/links';
import { conditionalRedirect } from '../../../main/helpers/RouterHelpers';
import pageJsonRaw from '../../../main/resources/locales/cy/translation/check-your-answers-et3-common.json';
import commonJsonRaw from '../../../main/resources/locales/cy/translation/common.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockDocumentTypeItemFromMockDocumentUploadResponse } from '../mocks/mockDocumentUploadResponse';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { createMockedUpdateET3ResponseWithET3FormFunction, mockFormError } from '../mocks/mockStaticFunctions';

jest.mock('../../../main/helpers/RouterHelpers', () => ({
  conditionalRedirect: jest.fn(),
}));

describe('CheckYourAnswersContestClaimController', () => {
  let controller: CheckYourAnswersContestClaimController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  const updateET3ResponseWithET3FormMock = jest.fn();
  beforeEach(() => {
    controller = new CheckYourAnswersContestClaimController();
    request = mockRequest({
      session: {
        mockCaseWithIdWithRespondents,
        selectedRespondent: {
          contestClaimSection: 'Yes',
        },
      },
    });
    ET3Util.updateET3ResponseWithET3Form = updateET3ResponseWithET3FormMock;
    response = mockResponse();
    jest.clearAllMocks();
  });

  describe('GET method', () => {
    it('should render the page', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CHECK_YOUR_ANSWERS_CONTEST_CLAIM, expect.anything());
    });

    it('should render the page with et3ResponseContestClaimDocument', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      request.session.userCase.et3ResponseContestClaimDocument = [
        {
          id: '1',
          value: mockDocumentTypeItemFromMockDocumentUploadResponse.value,
        },
      ];

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CHECK_YOUR_ANSWERS_CONTEST_CLAIM, expect.anything());
      expect(request.session.userCase.et3ResponseContestClaimDocument[0].value.shortDescription).toEqual(
        'Screenshot 2024-11-03 at 18.53.00.png'
      );
    });
  });

  describe('POST method', () => {
    it('should redirect to the respondent response task list on valid submission and YES is selected on Contact Claim CYA', async () => {
      (conditionalRedirect as jest.Mock).mockReturnValue(true);

      updateET3ResponseWithET3FormMock.mockImplementation(
        createMockedUpdateET3ResponseWithET3FormFunction(
          PageUrls.EMPLOYERS_CONTRACT_CLAIM,
          request,
          response,
          [],
          mockCaseWithIdWithRespondents
        )
      );
      await controller.post(request, response);

      expect(request.session.userCase).toEqual(mockCaseWithIdWithRespondents); // Validate the userCase is set
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.EMPLOYERS_CONTRACT_CLAIM); // Ensure the correct redirect occurs
      expect(updateET3ResponseWithET3FormMock).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(),
        expect.anything(),
        LinkStatus.COMPLETED,
        PageUrls.EMPLOYERS_CONTRACT_CLAIM
      );
    });

    it('should redirect to the respondent response task list on valid submission and NO is selected on Contact Claim CYA', async () => {
      (conditionalRedirect as jest.Mock).mockReturnValue(false);

      updateET3ResponseWithET3FormMock.mockImplementation(
        createMockedUpdateET3ResponseWithET3FormFunction(
          PageUrls.EMPLOYERS_CONTRACT_CLAIM,
          request,
          response,
          [],
          mockCaseWithIdWithRespondents
        )
      );

      await controller.post(request, response);

      expect(request.session.userCase).toEqual(mockCaseWithIdWithRespondents);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.EMPLOYERS_CONTRACT_CLAIM);
      expect(updateET3ResponseWithET3FormMock).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(),
        expect.anything(),
        LinkStatus.IN_PROGRESS_CYA,
        PageUrls.EMPLOYERS_CONTRACT_CLAIM
      );
    });
    it('should redirect to employers contract claim on valid submission and user case has breach of contract as type of claim', async () => {
      (conditionalRedirect as jest.Mock).mockReturnValue(true);

      updateET3ResponseWithET3FormMock.mockImplementation(
        createMockedUpdateET3ResponseWithET3FormFunction(
          PageUrls.EMPLOYERS_CONTRACT_CLAIM,
          request,
          response,
          [],
          mockCaseWithIdWithRespondents
        )
      );
      const req = _.cloneDeep(request);
      req.session.userCase = _.cloneDeep(mockCaseWithIdWithRespondents);
      req.session.userCase.typeOfClaim = [CLAIM_TYPES.BREACH_OF_CONTRACT];
      await controller.post(req, response);

      expect(request.session.userCase).toEqual(mockCaseWithIdWithRespondents); // Validate the userCase is set
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.EMPLOYERS_CONTRACT_CLAIM); // Ensure the correct redirect occurs
      expect(updateET3ResponseWithET3FormMock).toHaveBeenCalledWith(
        req,
        response,
        expect.anything(),
        expect.anything(),
        LinkStatus.COMPLETED,
        PageUrls.EMPLOYERS_CONTRACT_CLAIM
      );
    });
    it('should redirect back to Check Contest Claim if ET3 data update fails', async () => {
      updateET3ResponseWithET3FormMock.mockImplementation(
        createMockedUpdateET3ResponseWithET3FormFunction(
          request.url,
          request,
          response,
          [mockFormError],
          mockCaseWithIdWithRespondents
        )
      );
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(request.url);
      expect(request.session.errors).toEqual([mockFormError]); // Ensure the errors are still present
    });
  });
});
