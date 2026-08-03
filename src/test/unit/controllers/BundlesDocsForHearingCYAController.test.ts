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
});
