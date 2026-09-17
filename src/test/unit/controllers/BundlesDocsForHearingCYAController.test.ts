import BundlesDocsForHearingCYAController from '../../../main/controllers/BundlesDocsForHearingCYAController';
import { AgreedDocuments, WhatAreTheHearingDocuments, WhoseHearingDocument } from '../../../main/definitions/case';
import { InterceptPaths, TranslationKeys, languages } from '../../../main/definitions/constants';
import bundlesCyaJson from '../../../main/resources/locales/en/translation/bundles-docs-for-hearing-cya.json';
import commonJson from '../../../main/resources/locales/en/translation/common.json';
import { mockHearingCollection } from '../mocks/mockHearing';
import { mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Bundles docs for hearing CYA controller', () => {
  it('should render the check your answers page with summary content', () => {
    const controller = new BundlesDocsForHearingCYAController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, { ...commonJson, ...bundlesCyaJson });
    request.session.userCase.hearingCollection = mockHearingCollection;
    request.session.userCase.bundlesRespondentAgreedDocWith = AgreedDocuments.AGREEDBUT;
    request.session.userCase.hearingDocumentsAreFor = mockHearingCollection[0].id;
    request.session.userCase.whoseHearingDocumentsAreYouUploading = WhoseHearingDocument.BOTH_PARTIES;
    request.session.userCase.whatAreTheseDocuments = WhatAreTheHearingDocuments.SUPPLEMENTARY;
    request.session.userCase.hearingDocument = {
      document_url: 'http://dm/documents/doc-1',
      document_filename: 'Hearing Doc1.pdf',
      document_binary_url: 'http://dm/documents/doc-1/binary',
    };
    request.url = '/documents-for-hearing' + languages.ENGLISH_URL_PARAMETER;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.BUNDLES_DOCS_FOR_HEARING_CYA,
      expect.objectContaining({
        submitLink: InterceptPaths.SUBMIT_BUNDLES_HEARING_DOCS_CYA + languages.ENGLISH_URL_PARAMETER,
        cyaContent: expect.any(Array),
      })
    );
  });

  it('should fall back to stored hearing label and raw values when translations are missing', () => {
    const controller = new BundlesDocsForHearingCYAController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, { ...commonJson, ...bundlesCyaJson });
    request.session.userCase.hearingCollection = [];
    request.session.userCase.hearingDocumentsAreFor = 'missing-hearing';
    request.session.userCase.formattedSelectedHearing = 'Stored hearing label';
    request.session.userCase.whoseHearingDocumentsAreYouUploading = 'CustomWhose' as WhoseHearingDocument;
    request.session.userCase.whatAreTheseDocuments = 'CustomWhat' as WhatAreTheHearingDocuments;
    request.url = '/documents-for-hearing' + languages.ENGLISH_URL_PARAMETER;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.BUNDLES_DOCS_FOR_HEARING_CYA,
      expect.objectContaining({
        cyaContent: expect.arrayContaining([
          expect.objectContaining({ value: { text: 'Stored hearing label' } }),
          expect.objectContaining({ value: { text: 'CustomWhose' } }),
          expect.objectContaining({ value: { text: 'CustomWhat' } }),
        ]),
      })
    );
  });

  it('should render empty fallback labels when hearing document answers are missing', () => {
    const controller = new BundlesDocsForHearingCYAController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, { ...commonJson, ...bundlesCyaJson });
    request.session.userCase.hearingCollection = undefined;
    request.session.userCase.whoseHearingDocumentsAreYouUploading = undefined;
    request.session.userCase.whatAreTheseDocuments = undefined;
    request.session.userCase.formattedSelectedHearing = undefined;
    request.url = '/documents-for-hearing' + languages.ENGLISH_URL_PARAMETER;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.BUNDLES_DOCS_FOR_HEARING_CYA,
      expect.objectContaining({
        cyaContent: expect.any(Array),
      })
    );
  });

  it('should still render when user case is missing from the session', () => {
    const controller = new BundlesDocsForHearingCYAController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, { ...commonJson, ...bundlesCyaJson });
    request.session.userCase = undefined;
    request.url = '/documents-for-hearing' + languages.ENGLISH_URL_PARAMETER;

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.BUNDLES_DOCS_FOR_HEARING_CYA,
      expect.objectContaining({
        cyaContent: expect.any(Array),
      })
    );
  });
});
