import { HearingModel } from '../../../main/definitions/api/caseApiResponse';
import { CaseWithId } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import {
  createLabelForHearing,
  createRadioBtnsForHearings,
  getFileErrorMessage,
  getFilesRows,
  getPdfUploadError,
} from '../../../main/helpers/HearingDocumentsHelper';
import { mockFile, mockPdf } from '../mocks/mockFile';
import { mockHearingCollection } from '../mocks/mockHearing';

describe('HearingDocumentsHelper', () => {
  let collection: HearingModel[] = [];

  beforeEach(() => {
    collection = JSON.parse(JSON.stringify(mockHearingCollection));
  });

  describe('createRadioBtnsForHearings', () => {
    it('should return a label, name and value for each hearing', () => {
      const radioButtons = createRadioBtnsForHearings(collection);
      expect(radioButtons[0]).toEqual(
        expect.objectContaining({
          label: expect.any(String),
          name: 'hearingDocumentsAreFor',
          value: mockHearingCollection[0].id,
        })
      );
    });

    it('should return undefined if no hearings are present for future dates', () => {
      collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2022-07-04T14:00:00.000');
      const radioButtons = createRadioBtnsForHearings(collection);
      expect(radioButtons).toBeUndefined();
    });

    it('should return undefined if hearing status is not Listed even if date is in future', () => {
      collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2028-07-04T14:00:00.000');
      collection[0].value.hearingDateCollection[0].value.Hearing_status = 'Postponed';
      const radioButtons = createRadioBtnsForHearings(collection);
      expect(radioButtons).toBeUndefined();
    });

    it('should return undefined if hearing collection is empty', () => {
      expect(createRadioBtnsForHearings([])).toBeUndefined();
      expect(createRadioBtnsForHearings(undefined)).toBeUndefined();
    });
  });

  describe('createLabelForHearing', () => {
    it('should return a label with hearing number, hearing type, location and formatted date', () => {
      collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2038-07-04T14:00:00.000');
      const label = createLabelForHearing(collection[0]);
      expect(label).toEqual('3333 Hearing - RCJ - 4 July 2038');
    });

    it('should not return the hearing number if undefined', () => {
      collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2038-07-04T14:00:00.000');
      collection[0].value.hearingNumber = undefined;
      const label = createLabelForHearing(collection[0]);
      expect(label).toEqual(' Hearing - RCJ - 4 July 2038');
    });

    it('should return undefined when hearing has no date collection', () => {
      expect(createLabelForHearing(undefined as unknown as HearingModel)).toBeUndefined();
      expect(createLabelForHearing({ id: '1', value: {} } as HearingModel)).toBeUndefined();
      expect(createLabelForHearing({ id: '1', value: { hearingDateCollection: [] } } as HearingModel)).toBeUndefined();
    });

    it('should use Scotland venue when present and pick earliest future listed date', () => {
      collection[0].value.Hearing_venue_Scotland = 'Glasgow';
      collection[0].value.hearingDateCollection = [
        {
          id: 'later',
          value: {
            listedDate: new Date('2039-07-04T14:00:00.000'),
            Hearing_status: 'Listed',
            hearingTimingStart: new Date('2039-07-04T11:00:00.000'),
            hearingTimingFinish: new Date('2039-07-04T12:00:00.000'),
          },
        },
        {
          id: 'earlier',
          value: {
            listedDate: new Date('2038-01-04T14:00:00.000'),
            Hearing_status: 'Listed',
            hearingTimingStart: new Date('2038-01-04T11:00:00.000'),
            hearingTimingFinish: new Date('2038-01-04T12:00:00.000'),
          },
        },
      ];
      expect(createLabelForHearing(collection[0])).toEqual('3333 Hearing - Glasgow - 4 January 2038');
    });

    it('should fall back to empty venue and type when missing', () => {
      collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2038-07-04T14:00:00.000');
      collection[0].value.Hearing_type = undefined;
      collection[0].value.Hearing_venue_Scotland = undefined;
      collection[0].value.Hearing_venue = undefined;
      expect(createLabelForHearing(collection[0])).toEqual('3333  -  - 4 July 2038');
    });
  });

  describe('getFilesRows', () => {
    const translations = { noFilesUpload: 'No files uploaded', remove: 'Remove' };

    it('should return empty-state row when no hearing document is present', () => {
      expect(getFilesRows(undefined, 'hearing-1', translations)).toEqual([
        {
          key: { html: 'No files uploaded', classes: 'govuk-!-font-weight-regular-m' },
          value: { text: '' },
          actions: { items: [] },
        },
      ]);
      expect(getFilesRows({} as CaseWithId, 'hearing-1', translations)[0].key.html).toBe('No files uploaded');
    });

    it('should return uploaded file row with remove action', () => {
      const userCase = {
        hearingDocument: {
          document_url: 'http://dm/documents/doc-1',
          document_filename: 'Hearing Doc1.pdf',
          document_binary_url: 'http://dm/documents/doc-1/binary',
        },
      } as CaseWithId;

      const rows = getFilesRows(userCase, 'hearing-1', translations);
      expect(rows[0].key.text).toBe('Hearing Doc1.pdf');
      expect(rows[0].actions.items[0].href).toBe(PageUrls.HEARING_DOCUMENT_REMOVE.replace(':hearingId', 'hearing-1'));
      expect(rows[0].actions.items[0].text).toBe('Remove');
    });
  });

  describe('getPdfUploadError', () => {
    it('should require a file when none has been uploaded yet', () => {
      expect(getPdfUploadError(undefined, false, undefined, 'hearingDocument')).toEqual({
        propertyName: 'hearingDocument',
        errorType: 'required',
      });
    });

    it('should reject oversized files', () => {
      expect(getPdfUploadError(mockPdf, true, undefined, 'hearingDocument')).toEqual({
        propertyName: 'hearingDocument',
        errorType: 'invalidFileSize',
      });
    });

    it('should reject non-pdf files', () => {
      const file = { ...mockFile, originalname: 'file.docx' };
      expect(getPdfUploadError(file, false, undefined, 'hearingDocument')).toEqual({
        propertyName: 'hearingDocument',
        errorType: 'invalidFileFormat',
      });
    });

    it('should reject invalid file names', () => {
      const file = { ...mockPdf, originalname: 'bad?.pdf' };
      expect(getPdfUploadError(file, false, undefined, 'hearingDocument')).toEqual({
        propertyName: 'hearingDocument',
        errorType: 'invalidFileName',
      });
    });

    it('should return undefined for a valid pdf when a document is already uploaded', () => {
      expect(
        getPdfUploadError(
          undefined,
          false,
          { document_filename: 'a.pdf' } as CaseWithId['hearingDocument'],
          'hearingDocument'
        )
      ).toBeUndefined();
      expect(
        getPdfUploadError({ ...mockPdf, originalname: 'ok.pdf' }, false, undefined, 'hearingDocument')
      ).toBeUndefined();
    });
  });

  describe('getFileErrorMessage', () => {
    it('should return undefined when there are no errors', () => {
      expect(getFileErrorMessage(undefined, {})).toBeUndefined();
      expect(getFileErrorMessage([], { required: 'Required' })).toBeUndefined();
    });

    it('should return the latest hearingDocument error message', () => {
      const translations = { required: 'File required', invalidFileFormat: 'Wrong format' };
      expect(
        getFileErrorMessage(
          [
            { propertyName: 'other', errorType: 'required' },
            { propertyName: 'hearingDocument', errorType: 'required' },
            { propertyName: 'hearingDocument', errorType: 'invalidFileFormat' },
          ],
          translations
        )
      ).toBe('Wrong format');
    });

    it('should return undefined when errors do not relate to hearingDocument', () => {
      expect(
        getFileErrorMessage([{ propertyName: 'other', errorType: 'required' }], { required: 'Required' })
      ).toBeUndefined();
    });
  });
});
