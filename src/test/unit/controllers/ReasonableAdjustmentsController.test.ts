import ReasonableAdjustmentsController from '../../../main/controllers/ReasonableAdjustmentsController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { saveForLaterButton, submitButton } from '../../../main/definitions/radios';
import { AnyRecord } from '../../../main/definitions/util-types';
import { postLogic } from '../../../main/helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../../../main/helpers/FormHelper';
import { setUrlLanguage } from '../../../main/helpers/LanguageHelper';
import { isFieldFilledIn, isOptionSelected } from '../../../main/validators/validator';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/helpers/CaseHelpers');
jest.mock('../../../main/helpers/FormHelper');
jest.mock('../../../main/helpers/LanguageHelper');
jest.mock('../../../main/validators/validator');

describe('ReasonableAdjustmentsController', () => {
  let controller: ReasonableAdjustmentsController;
  let response: ReturnType<typeof mockResponse>;
  let request: ReturnType<typeof mockRequest>;
  let contentMock: AnyRecord;
  let translationMock: Record<string, string>;

  beforeEach(() => {
    controller = new ReasonableAdjustmentsController();
    response = mockResponse();
    request = mockRequest({
      session: {
        userCase: {},
      },
    });

    // Mock necessary methods and content
    contentMock = {
      fields: {
        reasonableAdjustments: {
          id: 'reasonableAdjustments',
          label: expect.any(Function),
          labelHidden: false,
          type: 'radios',
          values: [
            {
              name: 'reasonableAdjustments',
              label: (l: AnyRecord): string => l.yes,
              value: YesOrNo.YES,
              subFields: {
                reasonableAdjustmentsDetail: {
                  id: 'reasonableAdjustmentsDetail',
                  name: 'reasonableAdjustmentsDetail',
                  type: 'text',
                  labelSize: 'normal',
                  label: expect.any(Function),
                  validator: isFieldFilledIn,
                },
              },
            },
            {
              name: 'reasonableAdjustments',
              label: expect.any(Function),
              value: YesOrNo.NO,
            },
          ],
          validator: isOptionSelected,
        },
      },
      submit: submitButton,
      saveForLater: saveForLaterButton,
    };

    translationMock = {
      reasonableAdjustments: 'this is reasonableAdjustments',
      yes: 'Yes',
      radioNo: 'No',
      yesLabelText: 'this is yesLabelText',
    };

    // Mock translation function
    (request.t as unknown as jest.Mock).mockReturnValue(translationMock);

    (getPageContent as jest.Mock).mockReturnValue(contentMock);
    (setUrlLanguage as jest.Mock).mockReturnValue(PageUrls.REASONABLE_ADJUSTMENTS);
  });

  describe('GET method', () => {
    it('should render the Reasonable Adjustments page with the correct form content', () => {
      controller.get(request as unknown as AppRequest, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.REASONABLE_ADJUSTMENTS,
        expect.objectContaining({
          ...contentMock,
          redirectUrl: PageUrls.REASONABLE_ADJUSTMENTS,
          hideContactUs: true,
        })
      );
    });

    it('should call assignFormData with the correct form fields', () => {
      controller.get(request as unknown as AppRequest, response);

      expect(assignFormData).toHaveBeenCalledWith(
        request.session.userCase,
        expect.objectContaining({
          reasonableAdjustments: expect.any(Object),
        })
      );
    });

    it('should call setUrlLanguage with the correct arguments', () => {
      controller.get(request as unknown as AppRequest, response);

      expect(setUrlLanguage).toHaveBeenCalledWith(request, PageUrls.REASONABLE_ADJUSTMENTS);
    });
  });

  describe('POST method', () => {
    it('should call postLogic with the correct parameters', async () => {
      const postLogicMock = postLogic as jest.Mock;

      await controller.post(request as unknown as AppRequest, response);

      expect(postLogicMock).toHaveBeenCalledWith(
        request,
        response,
        expect.any(Object), // The form object
        expect.any(Object), // Logger
        PageUrls.NOT_IMPLEMENTED
      );
    });

    it('should use the isOptionSelected validator for reasonableAdjustments field', async () => {
      const formFields = controller['form'].getFormFields();
      const reasonableAdjustmentsField = formFields.reasonableAdjustments;

      expect(reasonableAdjustmentsField.validator).toBe(isOptionSelected);
    });

    it('should use the isFieldFilledIn validator for reasonableAdjustmentsDetail field when Yes is selected', async () => {
      const formFields = controller['form'].getFormFields();
      const reasonableAdjustmentsDetailField =
        formFields.reasonableAdjustments.values[0].subFields.reasonableAdjustmentsDetail;

      expect(reasonableAdjustmentsDetailField.validator).toBe(isFieldFilledIn);
    });
  });
});
