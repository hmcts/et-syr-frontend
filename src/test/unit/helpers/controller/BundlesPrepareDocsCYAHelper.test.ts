import { AgreedDocuments, WhatAreTheHearingDocuments, WhoseHearingDocument } from '../../../../main/definitions/case';
import { PageUrls } from '../../../../main/definitions/constants';
import {
  clearBundlesFields,
  createDownloadLinkForHearingDoc,
  getBundlesCyaContent,
} from '../../../../main/helpers/controller/BundlesPrepareDocsCYAHelper';
import mockUserCase from '../../mocks/mockUserCase';

describe('BundlesPrepareDocsCYAHelper', () => {
  describe('getBundlesCyaContent', () => {
    it('should build summary rows with change links', () => {
      const userCase = {
        ...mockUserCase,
        bundlesRespondentAgreedDocWith: AgreedDocuments.AGREEDBUT,
        hearingDocumentsAreFor: 'hearing-1',
        whoseHearingDocumentsAreYouUploading: WhoseHearingDocument.BOTH_PARTIES,
        whatAreTheseDocuments: WhatAreTheHearingDocuments.SUPPLEMENTARY,
        hearingDocument: {
          document_url: 'http://dm/documents/doc-1',
          document_filename: 'Hearing Doc1.pdf',
          document_binary_url: 'http://dm/documents/doc-1/binary',
        },
      };
      const translations = {
        q1: 'Have you agreed these documents?',
        q2: 'Select the hearing this document is for',
        q3: 'Whose hearing document are you uploading?',
        q4: 'What is this document?',
        q5: 'Your documents',
        change: 'Change',
      };

      const rows = getBundlesCyaContent(
        userCase,
        translations,
        '?lng=en',
        '<a href="/getSupportingMaterial/doc-1">Hearing Doc1.pdf</a>',
        WhoseHearingDocument.BOTH_PARTIES,
        WhatAreTheHearingDocuments.SUPPLEMENTARY,
        '1 Hearing - RCJ - 4 July 2038'
      );

      expect(rows).toHaveLength(5);
      expect(rows[0].actions.items[0].href).toBe(PageUrls.AGREEING_DOCUMENTS + '?lng=en');
      expect(rows[1].actions.items[0].href).toBe(PageUrls.ABOUT_HEARING_DOCUMENTS + '?lng=en');
      expect(rows[4].actions.items[0].href).toBe(
        PageUrls.HEARING_DOCUMENT_UPLOAD.replace(':hearingId', 'hearing-1') + '?lng=en'
      );
      expect(rows[4].value.html).toContain('Hearing Doc1.pdf');
    });

    it('should fall back to about hearing documents when hearing id is missing', () => {
      const rows = getBundlesCyaContent(
        { ...mockUserCase, hearingDocumentsAreFor: undefined },
        { q1: 'q1', q2: 'q2', q3: 'q3', q4: 'q4', q5: 'q5' },
        '?lng=en',
        '',
        '',
        '',
        ''
      );
      expect(rows[4].actions.items[0].href).toBe(PageUrls.ABOUT_HEARING_DOCUMENTS + '?lng=en');
      expect(rows[4].actions.items[0].text).toBe('Change');
    });

    it('should safely build rows when user case is undefined', () => {
      const rows = getBundlesCyaContent(
        undefined,
        { q1: 'q1', q2: 'q2', q3: 'q3', q4: 'q4', q5: 'q5' },
        '',
        '',
        '',
        '',
        ''
      );
      expect(rows).toHaveLength(5);
      expect(rows[0].value.text).toBeUndefined();
      expect(rows[4].actions.items[0].href).toBe(PageUrls.ABOUT_HEARING_DOCUMENTS);
    });
  });

  describe('clearBundlesFields', () => {
    it('should clear temporary hearing document fields', () => {
      const userCase = {
        ...mockUserCase,
        bundlesRespondentAgreedDocWith: AgreedDocuments.YES,
        hearingDocumentsAreFor: 'hearing-1',
        hearingDocument: {
          document_url: 'http://dm/documents/doc-1',
          document_filename: 'Hearing Doc1.pdf',
          document_binary_url: 'http://dm/documents/doc-1/binary',
        },
        formattedSelectedHearing: 'Hearing label',
      };

      clearBundlesFields(userCase);

      expect(userCase.bundlesRespondentAgreedDocWith).toBeUndefined();
      expect(userCase.hearingDocumentsAreFor).toBeUndefined();
      expect(userCase.hearingDocument).toBeUndefined();
      expect(userCase.formattedSelectedHearing).toBeUndefined();
    });
  });

  describe('createDownloadLinkForHearingDoc', () => {
    it('should return an empty string when no file is present', () => {
      expect(createDownloadLinkForHearingDoc(undefined)).toBe('');
    });

    it('should return a download link for a hearing document', () => {
      const link = createDownloadLinkForHearingDoc({
        document_url: 'http://dm/documents/doc-1',
        document_filename: 'Hearing Doc1.pdf',
        document_binary_url: 'http://dm/documents/doc-1/binary',
      });
      expect(link).toContain('Hearing Doc1.pdf');
      expect(link).toContain('/getSupportingMaterial/doc-1');
    });

    it('should return empty string when filename or url is missing', () => {
      expect(
        createDownloadLinkForHearingDoc({
          document_url: 'http://dm/documents/doc-1',
          document_filename: undefined,
          document_binary_url: 'http://dm/documents/doc-1/binary',
        })
      ).toBe('');
      expect(
        createDownloadLinkForHearingDoc({
          document_url: undefined,
          document_filename: 'Hearing Doc1.pdf',
          document_binary_url: 'http://dm/documents/doc-1/binary',
        })
      ).toBe('');
    });

    it('should fall back to the last path segment when document id cannot be parsed', () => {
      const link = createDownloadLinkForHearingDoc({
        document_url: 'doc-without-slash',
        document_filename: 'Hearing Doc1.pdf',
        document_binary_url: 'http://dm/documents/doc-1/binary',
      });
      expect(link).toContain('/getSupportingMaterial/doc-without-slash');
      expect(link).toContain('Hearing Doc1.pdf');
    });
  });
});
