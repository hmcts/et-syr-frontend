import { CaseWithId } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import { SummaryListRow } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import DocumentUtils from '../../utils/DocumentUtils';

export const getBundlesCyaContent = (
  userCase: CaseWithId | undefined,
  translations: AnyRecord,
  languageParam: string,
  downloadLink: string,
  whoseHearingDoc: string,
  whatAreHearingDocs: string,
  selectedHearing: string
): SummaryListRow[] => {
  const changeText = translations.change ?? 'Change';
  const hearingUploadUrl = userCase?.hearingDocumentsAreFor
    ? PageUrls.HEARING_DOCUMENT_UPLOAD.replace(':hearingId', userCase.hearingDocumentsAreFor) + languageParam
    : PageUrls.ABOUT_HEARING_DOCUMENTS + languageParam;

  return [
    {
      key: {
        text: translations.q1,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: userCase?.bundlesRespondentAgreedDocWith,
      },
      actions: {
        items: [
          {
            href: PageUrls.AGREEING_DOCUMENTS + languageParam,
            text: changeText,
            visuallyHiddenText: translations.q1,
          },
        ],
      },
    },
    {
      key: {
        text: translations.q2,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: selectedHearing,
      },
      actions: {
        items: [
          {
            href: PageUrls.ABOUT_HEARING_DOCUMENTS + languageParam,
            text: changeText,
            visuallyHiddenText: translations.q2,
          },
        ],
      },
    },
    {
      key: {
        text: translations.q3,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: whoseHearingDoc,
      },
      actions: {
        items: [
          {
            href: PageUrls.ABOUT_HEARING_DOCUMENTS + languageParam,
            text: changeText,
            visuallyHiddenText: translations.q3,
          },
        ],
      },
    },
    {
      key: {
        text: translations.q4,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: whatAreHearingDocs,
      },
      actions: {
        items: [
          {
            href: PageUrls.ABOUT_HEARING_DOCUMENTS + languageParam,
            text: changeText,
            visuallyHiddenText: translations.q4,
          },
        ],
      },
    },
    {
      key: {
        text: translations.q5,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: { html: downloadLink },
      actions: {
        items: [
          {
            href: hearingUploadUrl,
            text: changeText,
            visuallyHiddenText: translations.q5,
          },
        ],
      },
    },
  ];
};

export const clearBundlesFields = (userCase: CaseWithId): void => {
  userCase.whatAreTheseDocuments = undefined;
  userCase.whoseHearingDocumentsAreYouUploading = undefined;
  userCase.hearingDocumentsAreFor = undefined;
  userCase.hearingDocument = undefined;
  userCase.bundlesRespondentAgreedDocWith = undefined;
  userCase.bundlesRespondentAgreedDocWithBut = undefined;
  userCase.bundlesRespondentAgreedDocWithNo = undefined;
  userCase.formattedSelectedHearing = undefined;
};

export const createDownloadLinkForHearingDoc = (file: CaseWithId['hearingDocument']): string => {
  if (!file?.document_filename || !file?.document_url) {
    return '';
  }
  const documentId = DocumentUtils.findDocumentIdByURL(file.document_url) || file.document_url.split('/').pop() || '';
  const href = PageUrls.GET_SUPPORTING_MATERIAL.replace(':docId', documentId);
  return `<a href="${href}" target="_blank" class="govuk-link">${file.document_filename}</a>`;
};
