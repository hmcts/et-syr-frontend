import ReasonableAdjustmentsController from '../../../main/controllers/ReasonableAdjustmentsController';
import { CaseTypeId, YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CuiYourSupportFeature } from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import * as CuiYourSupportFeatureModule from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import pageJsonRaw from '../../../main/resources/locales/en/translation/reasonable-adjustments.json';
import ET3Util from '../../../main/utils/ET3Util';
import { mockCaseWithIdWithRespondents } from '../mocks/mockCaseWithId';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
const updateET3DataMock = jest.spyOn(ET3Util, 'updateET3Data');

describe('ReasonableAdjustmentsController', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: ReasonableAdjustmentsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new ReasonableAdjustmentsController();
    request = mockRequest({});
    response = mockResponse();
    updateET3DataMock.mockClear();
    jest.spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature').mockReturnValue(new CuiYourSupportFeature([]));
  });

  describe('GET method', () => {
    it('should render the page with the correct translations', async () => {
      request = mockRequestWithTranslation({}, translationJsons);
      await controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(TranslationKeys.REASONABLE_ADJUSTMENTS, expect.anything());
    });

    it('should redirect to Your Support when CUI Your Support is enabled for Scotland', async () => {
      jest
        .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
        .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
      request = mockRequestWithTranslation({ userCase: { caseTypeId: CaseTypeId.SCOTLAND } }, translationJsons);

      await controller.get(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.YOUR_SUPPORT);
    });
  });

  describe('POST method', () => {
    it('should call ET3Util.updateET3ResponseWithET3Form with the correct parameters when adjustments are selected', async () => {
      request = mockRequest({
        body: {
          et3ResponseRespondentSupportNeeded: 'yes',
          et3ResponseRespondentSupportDetails: 'Some adjustments',
        },
      });
      request.url = PageUrls.RESPONDENT_EMPLOYEES;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);
      await controller.post(request, response);
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_EMPLOYEES);
    });

    it('should redirect to the same page with errors when details are required but not provided', async () => {
      request = mockRequest({
        body: {
          et3ResponseRespondentSupportNeeded: YesOrNo.YES,
          et3ResponseRespondentSupportDetails: '',
        },
      });
      request.url = PageUrls.REASONABLE_ADJUSTMENTS;
      updateET3DataMock.mockResolvedValue(mockCaseWithIdWithRespondents);

      await controller.post(request, response);

      expect(response.redirect).toHaveBeenCalledWith(PageUrls.REASONABLE_ADJUSTMENTS);
      const errors = [{ propertyName: 'et3ResponseRespondentSupportDetails', errorType: 'required' }];
      expect(request.session.errors).toEqual(errors);
    });

    it('should redirect to Your Support without saving when CUI Your Support is enabled for Scotland', async () => {
      jest
        .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
        .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
      request = mockRequest({
        body: {
          et3ResponseRespondentSupportNeeded: YesOrNo.YES,
          et3ResponseRespondentSupportDetails: 'Some adjustments',
        },
        userCase: {
          caseTypeId: CaseTypeId.SCOTLAND,
        },
      });

      await controller.post(request, response);

      expect(updateET3DataMock).not.toHaveBeenCalled();
      expect(response.redirect).toHaveBeenCalledWith(PageUrls.YOUR_SUPPORT);
    });
  });
});
