import EmployersContractClaimDetailsController from '../../../main/controllers/EmployersContractClaimDetailsController';
import { FormFieldNames, PageUrls, TranslationKeys, ValidationErrors } from '../../../main/definitions/constants';
import { ET3HubLinkNames, LinkStatus } from '../../../main/definitions/links';
import EmployersContractClaimDetailsControllerHelper from '../../../main/helpers/controller/EmployersContractClaimDetailsControllerHelper';
import commonJsonRaw from '../../../main/resources/locales/en/translation/common.json';
import pageJsonRaw from '../../../main/resources/locales/en/translation/employers-contract-claim-details.json';
import ET3Util from '../../../main/utils/ET3Util';
import ErrorUtils from '../../../main/utils/ErrorUtils';
import FileUtils from '../../../main/utils/FileUtils';
import { mockDocumentUploadResponse } from '../mocks/mockDocumentUploadResponse';
import { mockValidMulterFile } from '../mocks/mockExpressMulterFile';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/utils/ET3Util');
jest.mock('../../../main/utils/FileUtils');
jest.mock('../../../main/helpers/controller/EmployersContractClaimDetailsControllerHelper');

describe('EmployersContractClaimDetailsController', () => {
  const translationJsons = { ...pageJsonRaw, ...commonJsonRaw };
  let controller: EmployersContractClaimDetailsController;
  let request: ReturnType<typeof mockRequest>;
  let response: ReturnType<typeof mockResponse>;

  beforeEach(() => {
    controller = new EmployersContractClaimDetailsController();
    request = mockRequest({});
    response = mockResponse();
  });

  describe('GET method', () => {
    it('should render the page with the correct translations', () => {
      request = mockRequestWithTranslation({}, translationJsons);
      controller.get(request, response);
      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.EMPLOYERS_CONTRACT_CLAIM_DETAILS,
        expect.objectContaining({
          hideContactUs: true,
        })
      );
    });
  });

  describe('POST method', () => {
    it('should call ET3Util.updateET3ResponseWithET3Form with the correct parameters', async () => {
      request = mockRequest({
        body: {
          et3ResponseEmployerClaimDetails: 'Some claim details text',
        },
      });
      request.url = PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS;

      await controller.post(request, response);

      expect(ET3Util.updateET3ResponseWithET3Form).toHaveBeenCalledWith(
        request,
        response,
        expect.anything(), // Form object
        ET3HubLinkNames.EmployersContractClaim,
        LinkStatus.IN_PROGRESS,
        PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM
      );
    });
  });
  it('should set session error when req.body.url is not empty', async () => {
    request = mockRequest({
      body: {
        et3ResponseEmployerClaimDetails: 'Some claim details text',
        url: 'https://dummy.url.com',
      },
    });
    request.url = PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS;

    await controller.post(request, response);
    expect(response.status).toHaveBeenCalledWith(200);
  });
  it('should set file not selected session error when req.body.upload and file is empty', async () => {
    request = mockRequest({
      body: {
        et3ResponseEmployerClaimDetails: 'Some claim details text',
        upload: true,
      },
    });
    request.url = PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS;
    request.file = null;

    await controller.post(request, response);
    expect(request.session.errors).toHaveLength(1);
    expect(request.session.errors).toEqual([
      {
        propertyName: FormFieldNames.EMPLOYERS_CONTRACT_CLAIM_DETAILS.CLAIM_SUMMARY_FILE_NAME,
        errorType: ValidationErrors.INVALID_FILE_NOT_SELECTED,
      },
    ]);
  });
  it('should set file size session error when req file size is too large', async () => {
    request = mockRequest({
      body: {
        et3ResponseEmployerClaimDetails: 'Some claim details text',
      },
    });
    request.url = PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS;
    request.file = mockValidMulterFile;
    request.fileTooLarge = true;
    await controller.post(request, response);
    expect(request.session.errors).toHaveLength(1);
    expect(request.session.errors).toEqual([
      {
        propertyName: FormFieldNames.EMPLOYERS_CONTRACT_CLAIM_DETAILS.CLAIM_SUMMARY_FILE_NAME,
        errorType: ValidationErrors.INVALID_FILE_SIZE,
      },
    ]);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS);
  });
  it('should redirect to employers contract claim details when request file is invalid', async () => {
    request = mockRequest({
      body: {
        et3ResponseEmployerClaimDetails: 'Some claim details text',
      },
    });
    request.url = PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS;
    request.file = mockValidMulterFile;
    FileUtils.checkFile = jest.fn().mockReturnValueOnce(false);
    await controller.post(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS);
  });
  it('should redirect to employers contract claim details when file is not uploaded', async () => {
    request = mockRequest({
      body: {
        et3ResponseEmployerClaimDetails: 'Some claim details text',
      },
    });
    request.url = PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS;
    request.file = mockValidMulterFile;
    request.fileTooLarge = false;
    FileUtils.checkFile = jest.fn().mockReturnValueOnce(true);
    FileUtils.uploadFile = jest.fn().mockResolvedValueOnce(undefined);
    await controller.post(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS);
  });
  it('should redirect to employers contract claim details when input values are not valid', async () => {
    request = mockRequest({
      body: {
        et3ResponseEmployerClaimDetails: 'Some claim details text',
      },
    });
    request.url = PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS;
    request.file = mockValidMulterFile;
    request.fileTooLarge = false;
    FileUtils.checkFile = jest.fn().mockReturnValueOnce(true);
    FileUtils.uploadFile = jest.fn().mockResolvedValueOnce(mockDocumentUploadResponse);
    EmployersContractClaimDetailsControllerHelper.areInputValuesValid = jest.fn().mockImplementationOnce(() => {
      ErrorUtils.setManualErrorToRequestSessionWithExistingErrors(
        request,
        ValidationErrors.REQUIRED,
        FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD
      );
    });
    await controller.post(request, response);
    expect(request.session.errors).toEqual([
      {
        propertyName: FormFieldNames.GENERIC_FORM_FIELDS.HIDDEN_ERROR_FIELD,
        errorType: ValidationErrors.REQUIRED,
      },
    ]);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS);
  });
  it('should redirect to employers contract claim details when request body upload is true', async () => {
    request = mockRequest({
      body: {
        et3ResponseEmployerClaimDetails: 'Some claim details text',
        upload: true,
      },
    });
    request.url = PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS;
    request.file = mockValidMulterFile;
    request.fileTooLarge = false;
    FileUtils.checkFile = jest.fn().mockReturnValueOnce(true);
    FileUtils.uploadFile = jest.fn().mockResolvedValueOnce(mockDocumentUploadResponse);
    EmployersContractClaimDetailsControllerHelper.areInputValuesValid = jest.fn().mockImplementationOnce(() => {
      return;
    });
    ET3Util.updateET3ResponseWithET3Form = jest.fn().mockImplementationOnce(() => {
      response.redirect(PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS);
    });
    await controller.post(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS);
  });
  it('should redirect to check your answers employers contract claim when request body upload is empty', async () => {
    request = mockRequest({
      body: {
        et3ResponseEmployerClaimDetails: 'Some claim details text',
        upload: false,
      },
    });

    request.file = mockValidMulterFile;
    request.fileTooLarge = false;
    request.url = PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS;

    FileUtils.uploadFile = jest.fn().mockResolvedValueOnce(mockDocumentUploadResponse);
    EmployersContractClaimDetailsControllerHelper.areInputValuesValid = jest.fn().mockImplementationOnce(() => {
      return;
    });
    FileUtils.checkFile = jest.fn().mockReturnValueOnce(true);
    ET3Util.updateET3ResponseWithET3Form = jest.fn().mockImplementationOnce(() => {
      response.redirect(PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM);
    });
    await controller.post(request, response);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM);
  });
});
