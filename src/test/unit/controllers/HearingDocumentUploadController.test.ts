import HearingDocumentUploadController from '../../../main/controllers/HearingDocumentUploadController';
import { ErrorPages, PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import pageTranslations from '../../../main/resources/locales/en/translation/hearing-document-upload.json';
import * as FileUtilsModule from '../../../main/utils/FileUtils';
import { mockDocumentUploadResponse } from '../mocks/mockDocumentUploadResponse';
import { mockFile, mockPdf } from '../mocks/mockFile';
import { mockHearingCollection } from '../mocks/mockHearing';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Hearing Document Upload controller', () => {
  const t = {
    'hearing-document-upload': {},
    common: {},
  };
  const translationJsons = { ...pageTranslations };

  beforeEach(() => {
    jest.spyOn(FileUtilsModule.default, 'uploadFile').mockResolvedValue({
      ...mockDocumentUploadResponse,
      originalDocumentName: 'test.pdf',
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render hearing document file upload page', () => {
    const controller = new HearingDocumentUploadController();
    const res = mockResponse();
    const req = mockRequestWithTranslation({ t }, translationJsons);
    req.params.hearingId = '12345-abc-12345';

    controller.get(req, res);
    expect(res.render).toHaveBeenCalledWith(TranslationKeys.HEARING_DOCUMENT_UPLOAD, expect.anything());
  });

  it('should disable upload button when a document is already present', () => {
    const controller = new HearingDocumentUploadController();
    const res = mockResponse();
    const req = mockRequestWithTranslation({ t }, translationJsons);
    req.params.hearingId = '12345-abc-12345';
    req.session.userCase.hearingDocument = {
      document_url: 'http://test',
      document_filename: 'Hearing Doc1.pdf',
      document_binary_url: 'http://test/binary',
    };

    controller.get(req, res);
    expect(res.render).toHaveBeenCalledWith(TranslationKeys.HEARING_DOCUMENT_UPLOAD, expect.anything());
  });

  describe('Correct validation', () => {
    it('should require a pdf file to be uploaded', async () => {
      const req = mockRequest({ body: {} });
      req.session.userCase.hearingCollection = mockHearingCollection;
      req.params.hearingId = '12345-abc-12345';
      await new HearingDocumentUploadController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'hearingDocument', errorType: 'required' }]);
    });

    it('should only allow pdf file types to be uploaded', async () => {
      const newFile = { ...mockFile };
      newFile.originalname = 'file.invalidFileFormat';
      const req = mockRequest({ body: {}, file: newFile });
      req.session.userCase.hearingCollection = mockHearingCollection;
      req.params.hearingId = '12345-abc-12345';
      await new HearingDocumentUploadController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'hearingDocument', errorType: 'invalidFileFormat' }]);
    });

    it('should only allow valid file sizes', async () => {
      const newFile = { ...mockPdf };
      newFile.originalname = 'file.pdf';
      const req = mockRequest({ body: {}, file: newFile });
      req.session.userCase.hearingCollection = mockHearingCollection;
      req.params.hearingId = '12345-abc-12345';
      req.fileTooLarge = true;
      await new HearingDocumentUploadController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'hearingDocument', errorType: 'invalidFileSize' }]);
    });

    it('should only allow valid file names', async () => {
      const newFile = { ...mockPdf };
      newFile.originalname = '$%?invalid.pdf';
      const req = mockRequest({ body: {}, file: newFile });
      req.session.userCase.hearingCollection = mockHearingCollection;
      req.params.hearingId = '12345-abc-12345';
      await new HearingDocumentUploadController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'hearingDocument', errorType: 'invalidFileName' }]);
    });

    it('should redirect to check your answers when a file has already been uploaded', async () => {
      const req = mockRequest({ body: {} });
      req.session.userCase.hearingCollection = mockHearingCollection;
      req.session.userCase.hearingDocument = {
        document_url: 'http://test',
        document_filename: 'Hearing Doc1.pdf',
        document_binary_url: 'http://test/binary',
      };
      req.params.hearingId = '12345-abc-12345';
      req.url = PageUrls.HEARING_DOCUMENT_UPLOAD + languages.ENGLISH_URL_PARAMETER;
      const res = mockResponse();

      await new HearingDocumentUploadController().post(req, res);

      expect(req.session.errors).toHaveLength(0);
      expect(res.redirect).toHaveBeenCalledWith(
        PageUrls.BUNDLES_DOCS_FOR_HEARING_CYA + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should upload a file and stay on the page when upload is selected', async () => {
      const newFile = { ...mockPdf };
      newFile.originalname = 'Hearing Doc1.pdf';
      const req = mockRequest({ body: { upload: 'true' }, file: newFile });
      req.session.userCase.hearingCollection = mockHearingCollection;
      req.params.hearingId = '12345-abc-12345';
      req.url = PageUrls.HEARING_DOCUMENT_UPLOAD + languages.ENGLISH_URL_PARAMETER;
      const res = mockResponse();

      await new HearingDocumentUploadController().post(req, res);

      expect(req.session.userCase.hearingDocument.document_filename).toBe('test.pdf');
      expect(res.redirect).toHaveBeenCalledWith(
        PageUrls.HEARING_DOCUMENT_UPLOAD.replace(':hearingId', '12345-abc-12345') + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should redirect to not found when hearing id is invalid', async () => {
      const req = mockRequest({ body: {} });
      req.session.userCase.hearingCollection = mockHearingCollection;
      req.session.userCase.hearingDocument = {
        document_url: 'http://test',
        document_filename: 'Hearing Doc1.pdf',
        document_binary_url: 'http://test/binary',
      };
      req.params.hearingId = 'missing-hearing';
      req.url = PageUrls.HEARING_DOCUMENT_UPLOAD + languages.ENGLISH_URL_PARAMETER;
      const res = mockResponse();

      await new HearingDocumentUploadController().post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + languages.ENGLISH_URL_PARAMETER);
    });

    it('should require a file when upload is selected without a new file', async () => {
      const req = mockRequest({ body: { upload: 'true' } });
      req.session.userCase.hearingCollection = mockHearingCollection;
      req.session.userCase.hearingDocument = {
        document_url: 'http://test',
        document_filename: 'Hearing Doc1.pdf',
        document_binary_url: 'http://test/binary',
      };
      req.file = undefined;
      req.params.hearingId = '12345-abc-12345';
      req.url = PageUrls.HEARING_DOCUMENT_UPLOAD + languages.ENGLISH_URL_PARAMETER;
      const res = mockResponse();

      await new HearingDocumentUploadController().post(req, res);

      expect(req.session.errors).toEqual([{ propertyName: 'hearingDocument', errorType: 'required' }]);
      expect(res.redirect).toHaveBeenCalledWith(
        PageUrls.HEARING_DOCUMENT_UPLOAD.replace(':hearingId', '12345-abc-12345') + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should set backend error when upload returns no response', async () => {
      jest.spyOn(FileUtilsModule.default, 'uploadFile').mockResolvedValue(undefined);
      const newFile = { ...mockPdf, originalname: 'Hearing Doc1.pdf' };
      const req = mockRequest({ body: { upload: 'true' }, file: newFile });
      req.session.userCase.hearingCollection = mockHearingCollection;
      req.params.hearingId = '12345-abc-12345';
      req.url = PageUrls.HEARING_DOCUMENT_UPLOAD + languages.ENGLISH_URL_PARAMETER;
      const res = mockResponse();

      await new HearingDocumentUploadController().post(req, res);

      expect(req.session.errors).toEqual([{ propertyName: 'hearingDocument', errorType: 'backEndError' }]);
    });

    it('should set backend error when upload throws', async () => {
      jest.spyOn(FileUtilsModule.default, 'uploadFile').mockRejectedValue(new Error('upload failed'));
      const newFile = { ...mockPdf, originalname: 'Hearing Doc1.pdf' };
      const req = mockRequest({ body: { upload: 'true' }, file: newFile });
      req.session.userCase.hearingCollection = mockHearingCollection;
      req.params.hearingId = '12345-abc-12345';
      req.url = PageUrls.HEARING_DOCUMENT_UPLOAD + languages.ENGLISH_URL_PARAMETER;
      const res = mockResponse();

      await new HearingDocumentUploadController().post(req, res);

      expect(req.session.errors).toEqual([{ propertyName: 'hearingDocument', errorType: 'backEndError' }]);
    });

    it('should require a file when upload is selected with an empty file object', async () => {
      const req = mockRequest({ body: { upload: 'true' }, file: {} as Express.Multer.File });
      req.session.userCase.hearingCollection = mockHearingCollection;
      req.params.hearingId = '12345-abc-12345';
      req.url = PageUrls.HEARING_DOCUMENT_UPLOAD + languages.ENGLISH_URL_PARAMETER;
      const res = mockResponse();

      await new HearingDocumentUploadController().post(req, res);

      expect(req.session.errors).toEqual([{ propertyName: 'hearingDocument', errorType: 'required' }]);
      expect(res.redirect).toHaveBeenCalledWith(
        PageUrls.HEARING_DOCUMENT_UPLOAD.replace(':hearingId', '12345-abc-12345') + languages.ENGLISH_URL_PARAMETER
      );
    });

    it('should require an uploaded document when continuing with only a selected file', async () => {
      const newFile = { ...mockPdf, originalname: 'Hearing Doc1.pdf' };
      const req = mockRequest({ body: {}, file: newFile });
      req.session.userCase.hearingCollection = mockHearingCollection;
      req.params.hearingId = '12345-abc-12345';
      req.url = PageUrls.HEARING_DOCUMENT_UPLOAD + languages.ENGLISH_URL_PARAMETER;
      const res = mockResponse();

      await new HearingDocumentUploadController().post(req, res);

      expect(req.session.errors).toEqual([{ propertyName: 'hearingDocument', errorType: 'required' }]);
      expect(res.redirect).toHaveBeenCalledWith(
        PageUrls.HEARING_DOCUMENT_UPLOAD.replace(':hearingId', '12345-abc-12345') + languages.ENGLISH_URL_PARAMETER
      );
    });
  });
});
