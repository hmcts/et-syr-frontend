import { HearingModel } from '../definitions/api/caseApiResponse';
import { CaseWithId, Document } from '../definitions/case';
import { PageUrls } from '../definitions/constants';
import { FormError } from '../definitions/form';
import { SummaryListRow } from '../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../definitions/util-types';
import { hasInvalidFileName, isNotPdfFileType } from '../validators/validator';

const formatDate = (rawDate: Date): string =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(rawDate));

/**
 * Build a display label for an unheard (future, Listed) hearing.
 * Returns undefined when the hearing has no future Listed dates.
 */
export const createLabelForHearing = (hearing: HearingModel): string | undefined => {
  if (!hearing?.value?.hearingDateCollection?.length) {
    return undefined;
  }

  const hearingsInFuture = hearing.value.hearingDateCollection.filter(
    item => new Date(item.value.listedDate) > new Date() && item.value.Hearing_status === 'Listed'
  );

  if (!hearingsInFuture.length) {
    return undefined;
  }

  const earliestDate = hearingsInFuture.reduce(
    (earliest, current) =>
      new Date(earliest.value.listedDate) > new Date(current.value.listedDate) ? current : earliest,
    hearingsInFuture[0]
  );
  const venue = hearing.value?.Hearing_venue_Scotland || hearing.value?.Hearing_venue?.value?.label;
  return `${hearing.value.hearingNumber ?? ''} ${hearing.value.Hearing_type ?? ''} - ${venue ?? ''} - ${formatDate(
    earliestDate.value.listedDate
  )}`;
};

/**
 * Create radio options for all unheard hearings in the collection.
 */
export const createRadioBtnsForHearings = (
  hearingCollection: HearingModel[] | undefined
): { name: string; label: string; value: string }[] | undefined => {
  if (!hearingCollection?.length) {
    return undefined;
  }

  const filtered = hearingCollection.filter(hearing => !!createLabelForHearing(hearing));
  if (!filtered.length) {
    return undefined;
  }

  return filtered.map(hearing => ({
    label: createLabelForHearing(hearing) as string,
    value: hearing.id,
    name: 'hearingDocumentsAreFor',
  }));
};

export const getFilesRows = (
  userCase: CaseWithId | undefined,
  hearingId: string,
  translations: AnyRecord
): SummaryListRow[] => {
  if (userCase?.hearingDocument === undefined) {
    return [
      {
        key: {
          html: translations.noFilesUpload,
          classes: 'govuk-!-font-weight-regular-m',
        },
        value: {
          text: '',
        },
        actions: {
          items: [],
        },
      },
    ];
  }

  return [
    {
      key: {
        text: userCase.hearingDocument.document_filename,
        classes: 'govuk-!-font-weight-regular-m',
      },
      value: {
        text: '',
      },
      actions: {
        items: [
          {
            href: PageUrls.HEARING_DOCUMENT_REMOVE.replace(':hearingId', hearingId),
            text: translations.remove,
            visuallyHiddenText: translations.remove,
          },
        ],
      },
    },
  ];
};

export const getPdfUploadError = (
  file: Express.Multer.File,
  fileTooLarge: boolean,
  uploadedFile: Document,
  propertyName: string
): FormError | undefined => {
  const fileProvided = file !== undefined;

  if (!fileProvided && !uploadedFile) {
    return { propertyName, errorType: 'required' };
  }

  if (fileTooLarge) {
    return { propertyName, errorType: 'invalidFileSize' };
  }

  const fileFormatInvalid = isNotPdfFileType(file);
  if (fileFormatInvalid) {
    return { propertyName, errorType: fileFormatInvalid };
  }

  const fileNameInvalid = hasInvalidFileName(file?.originalname);
  if (fileNameInvalid) {
    return { propertyName, errorType: fileNameInvalid };
  }

  return undefined;
};

export const getFileErrorMessage = (errors: FormError[], errorTranslations: AnyRecord): string | undefined => {
  if (!errors?.length) {
    return undefined;
  }
  for (let i = errors.length - 1; i >= 0; i--) {
    if (errors[i].propertyName === 'hearingDocument') {
      return errorTranslations[errors[i].errorType];
    }
  }
  return undefined;
};
