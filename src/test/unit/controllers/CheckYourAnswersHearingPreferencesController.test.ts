import CheckYourAnswersHearingPreferencesController from '../../../main/controllers/CheckYourAnswersHearingPreferencesController';
import { CaseTypeId } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { LinkStatus } from '../../../main/definitions/links';
import { conditionalRedirect } from '../../../main/helpers/RouterHelpers'; // Ensure this import is correct
import { CuiYourSupportFeature } from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import * as CuiYourSupportFeatureModule from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import pageJsonRaw from '../../../main/resources/locales/cy/translation/check-your-answers-et3-common.json';
import commonJsonRaw from '../../../main/resources/locales/cy/translation/common.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { createMockedUpdateET3ResponseWithET3FormFunction, mockFormError } from '../mocks/mockStaticFunctions';

jest.mock('../../../main/helpers/RouterHelpers', () => ({
  conditionalRedirect: jest.fn(),
}));

describe('CheckYourAnswersHearingPreferencesController', () => {
  let controller: CheckYourAnswersHearingPreferencesController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  const updateET3ResponseWithET3FormMock = jest.fn();

  beforeEach(() => {
    controller = new CheckYourAnswersHearingPreferencesController();
    request = mockRequest({
      session: {
        userCase: mockCaseWithIdWithRespondents,
        selectedRespondent: {
          hearingPreferencesSection: 'Yes',
        },
      },
    });
    ET3Util.updateET3ResponseWithET3Form = updateET3ResponseWithET3FormMock;
    response = mockResponse();
    jest.clearAllMocks();
    jest.spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature').mockReturnValue(new CuiYourSupportFeature([]));
  });

  describe('GET method', () => {
    it('should render the page', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES,
        expect.anything()
      );
    });
  });

  describe('POST method', () => {
    it('should go to reasonable adjustments by default on valid submission when Yes is selected', async () => {
      (conditionalRedirect as jest.Mock).mockReturnValue(true);

      updateET3ResponseWithET3FormMock.mockImplementation(
        createMockedUpdateET3ResponseWithET3FormFunction(
          PageUrls.REASONABLE_ADJUSTMENTS,
          request,
          response,
          [],
          mockCaseWithIdWithRespondents
        )
      );

      await controller.post(request, response);

      expect(request.session.userCase).toEqual(mockCaseWithIdWithRespondents);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.REASONABLE_ADJUSTMENTS);
      expect(updateET3ResponseWithET3FormMock).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(),
        expect.anything(),
        LinkStatus.COMPLETED,
        PageUrls.REASONABLE_ADJUSTMENTS
      );
    });

    it('should go to your support for enabled Scotland on valid submission when No is selected', async () => {
      jest
        .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
        .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
      request.session.userCase.caseTypeId = CaseTypeId.SCOTLAND;
      (conditionalRedirect as jest.Mock).mockReturnValue(false);

      updateET3ResponseWithET3FormMock.mockImplementation(
        createMockedUpdateET3ResponseWithET3FormFunction(
          PageUrls.YOUR_SUPPORT,
          request,
          response,
          [],
          mockCaseWithIdWithRespondents
        )
      );

      await controller.post(request, response);

      expect(request.session.userCase).toEqual(mockCaseWithIdWithRespondents);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.YOUR_SUPPORT);
      expect(updateET3ResponseWithET3FormMock).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(),
        expect.anything(),
        LinkStatus.IN_PROGRESS_CYA,
        PageUrls.YOUR_SUPPORT
      );
    });

    it('should redirect back to Hearing Preferences if ET3 data update fails', async () => {
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
      expect(request.session.errors).toEqual([mockFormError]);
    });
  });
});
