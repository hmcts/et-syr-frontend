import AboutHearingDocumentsController from '../../../main/controllers/AboutHearingDocumentsController';
import { WhatAreTheHearingDocuments, WhoseHearingDocument } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import aboutHearingDocumentsJson from '../../../main/resources/locales/en/translation/about-hearing-documents.json';
import { mockHearingCollectionFutureDates } from '../mocks/mockHearing';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('About Hearing Documents Controller', () => {
  it('should render the About Hearing Documents page', async () => {
    const controller = new AboutHearingDocumentsController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, aboutHearingDocumentsJson);
    request.session.userCase.hearingCollection = mockHearingCollectionFutureDates;
    request.url = PageUrls.ABOUT_HEARING_DOCUMENTS + languages.ENGLISH_URL_PARAMETER;
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.ABOUT_HEARING_DOCUMENTS, expect.anything());
  });

  it('should redirect to the same screen when hearing is not selected', async () => {
    const body = {
      whoseHearingDocumentsAreYouUploading: WhoseHearingDocument.BOTH_PARTIES,
      whatAreTheseDocuments: WhatAreTheHearingDocuments.SUPPLEMENTARY,
    };
    const response = mockResponse();
    const request = mockRequest({ body });
    request.session.userCase.hearingCollection = mockHearingCollectionFutureDates;
    request.url = PageUrls.ABOUT_HEARING_DOCUMENTS + languages.ENGLISH_URL_PARAMETER;

    const controller = new AboutHearingDocumentsController();
    await controller.post(request, response);

    expect(request.session.errors).toEqual([{ propertyName: 'hearingDocumentsAreFor', errorType: 'required' }]);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.ABOUT_HEARING_DOCUMENTS + languages.ENGLISH_URL_PARAMETER);
  });

  it('should redirect to the next page when there are no errors', async () => {
    const body = {
      hearingDocumentsAreFor: '12345abc',
      whoseHearingDocumentsAreYouUploading: WhoseHearingDocument.BOTH_PARTIES,
      whatAreTheseDocuments: WhatAreTheHearingDocuments.SUPPLEMENTARY,
    };
    const response = mockResponse();
    const request = mockRequest({ body });
    request.session.userCase.hearingCollection = mockHearingCollectionFutureDates;
    request.url = PageUrls.ABOUT_HEARING_DOCUMENTS + languages.ENGLISH_URL_PARAMETER;

    const controller = new AboutHearingDocumentsController();
    await controller.post(request, response);

    expect(request.session.errors).toHaveLength(0);
    expect(request.session.userCase.hearingDocumentsAreFor).toBe('12345abc');
    expect(response.redirect).toHaveBeenCalledWith(
      '/hearing-document-upload/12345abc' + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should return errors when whose and what questions are unanswered', async () => {
    const body = {
      hearingDocumentsAreFor: '12345abc',
    };
    const response = mockResponse();
    const request = mockRequest({ body });
    request.session.userCase.hearingCollection = mockHearingCollectionFutureDates;
    request.url = PageUrls.ABOUT_HEARING_DOCUMENTS + languages.ENGLISH_URL_PARAMETER;

    const controller = new AboutHearingDocumentsController();
    await controller.post(request, response);

    expect(request.session.errors).toEqual([
      { propertyName: 'whoseHearingDocumentsAreYouUploading', errorType: 'required' },
      { propertyName: 'whatAreTheseDocuments', errorType: 'required' },
    ]);
  });

  it('should redirect to case details if no hearings are present', async () => {
    const controller = new AboutHearingDocumentsController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, aboutHearingDocumentsJson);
    request.url = PageUrls.ABOUT_HEARING_DOCUMENTS + languages.ENGLISH_URL_PARAMETER;
    await controller.get(request, response);
    expect(response.redirect).toHaveBeenCalled();
  });

  it('should redirect to case details if there are no hearings for future dates', async () => {
    const controller = new AboutHearingDocumentsController();
    const response = mockResponse();
    const request = mockRequestWithTranslation({}, aboutHearingDocumentsJson);
    request.session.userCase.hearingCollection = [
      {
        id: '236c8a94-e485-4034-bbdb-99f982679138',
        value: {
          Hearing_type: 'Hearing',
          Hearing_notes: 'notes',
          Hearing_stage: 'Stage 1',
          Hearing_venue: {
            value: {
              code: 'RCJ',
              label: 'RCJ',
            },
            list_items: [],
            selectedCode: 'RCJ',
            selectedLabel: 'RCJ',
          },
          hearingFormat: ['In person'],
          hearingNumber: '3333',
          hearingSitAlone: 'Sit Alone',
          judicialMediation: 'Yes',
          hearingEstLengthNum: 22,
          hearingPublicPrivate: 'Public',
          hearingDateCollection: [
            {
              id: '3890feaa-ad4b-4822-9040-3bc09279450a',
              value: {
                listedDate: new Date('2022-07-04T14:00:00.000'),
                Hearing_status: 'Listed',
                hearingTimingStart: new Date('2022-04-13T11:00:00.000'),
                hearingTimingFinish: new Date('2022-04-13T11:00:00.000'),
              },
            },
          ],
        },
      },
    ];
    request.url = PageUrls.ABOUT_HEARING_DOCUMENTS + languages.ENGLISH_URL_PARAMETER;
    await controller.get(request, response);
    expect(response.redirect).toHaveBeenCalled();
  });
});
