import { AppRequest } from '../../definitions/appRequest';
import { RespondentET3Model } from '../../definitions/case';
import { DocumentTypeItem } from '../../definitions/complexTypes/documentTypeItem';
import { Et3ResponseStatus, responseAcceptedDocTypes } from '../../definitions/constants';
import { LinkStatus } from '../../definitions/links';
import DateUtils from '../../utils/DateUtils';
import DocumentUtils from '../../utils/DocumentUtils';
import StringUtils from '../../utils/StringUtils';
import { dateInLocale } from '../dateInLocale';

const RESPONSE_ACCEPTED = 'Response accepted';

export interface OtherRespondentEt3Labels {
  et3FormText: string;
  et3AttachmentText: string;
  acceptanceLetter: string;
}

interface StoredDocument {
  document_url?: string;
  document_filename?: string;
  upload_timestamp?: string;
  createdOn?: string;
}

interface ListedDocument {
  id: string;
  urlId: string;
  name: string;
  dateRaw?: string;
  kind: 'form' | 'attachment' | 'accepted';
}

interface TableCell {
  text?: string;
  html?: string;
}

export const getOtherRespondentEt3LinkStatus = (req: AppRequest, existingStatus: LinkStatus): LinkStatus => {
  if (!hasAcceptedOtherRespondentEt3(req)) {
    return LinkStatus.NOT_YET_AVAILABLE;
  }
  if (existingStatus === LinkStatus.VIEWED) {
    return LinkStatus.VIEWED;
  }
  return LinkStatus.READY_TO_VIEW;
};

export const getOtherRespondentEt3TableRows = (req: AppRequest, labels: OtherRespondentEt3Labels): TableCell[][] => {
  return listOtherRespondentEt3Documents(req)
    .map(document => toTableRow(req, document, labels))
    .filter((row): row is TableCell[] => row !== undefined);
};

const hasAcceptedOtherRespondentEt3 = (req: AppRequest): boolean => {
  const respondents = req.session?.userCase?.respondents;
  const selectedIndex = req.session?.selectedRespondentIndex;
  if (!respondents || respondents.length < 2 || selectedIndex === undefined || selectedIndex === null) {
    return false;
  }
  return respondents.some((respondent, index) => index !== selectedIndex && isAcceptedRespondent(respondent));
};

const listOtherRespondentEt3Documents = (req: AppRequest): ListedDocument[] => {
  const respondents = req.session?.userCase?.respondents || [];
  const selectedIndex = req.session?.selectedRespondentIndex;
  const currentRespondent =
    selectedIndex === undefined || selectedIndex === null ? undefined : respondents[selectedIndex];
  const currentDocumentIds = collectRespondentDocumentIds(currentRespondent);
  const documentsByUrlId = new Map<string, ListedDocument>();

  respondents.forEach((respondent, index) => {
    if (index === selectedIndex || !isAcceptedRespondent(respondent)) {
      return;
    }
    addRespondentDocuments(documentsByUrlId, respondent);
  });

  applyDocumentCollection(req.session?.userCase?.documentCollection, documentsByUrlId, currentDocumentIds);

  return Array.from(documentsByUrlId.values()).sort(
    (left, right) => documentTime(right.dateRaw) - documentTime(left.dateRaw)
  );
};

const isAcceptedRespondent = (respondent: RespondentET3Model): boolean => {
  return respondent?.responseStatus === Et3ResponseStatus.ET3_RESPONSE_STATUS_ACCEPTED;
};

const addRespondentDocuments = (
  documentsByUrlId: Map<string, ListedDocument>,
  respondent: RespondentET3Model
): void => {
  addUploadedDocument(documentsByUrlId, respondent.et3Form, 'form', respondent.responseReceivedDate);
  addUploadedDocument(documentsByUrlId, respondent.et3FormWelsh, 'form', respondent.responseReceivedDate);
  addUploadedDocument(
    documentsByUrlId,
    respondent.et3ResponseEmployerClaimDocument,
    'attachment',
    respondent.responseReceivedDate
  );
  addUploadedDocument(
    documentsByUrlId,
    respondent.et3ResponseRespondentSupportDocument,
    'attachment',
    respondent.responseReceivedDate
  );
  respondent.et3ResponseContestClaimDocument?.forEach(document => {
    addUploadedDocument(
      documentsByUrlId,
      document?.value?.uploadedDocument,
      'attachment',
      document?.value?.dateOfCorrespondence || document?.value?.creationDate || respondent.responseReceivedDate
    );
  });
};

const addUploadedDocument = (
  documentsByUrlId: Map<string, ListedDocument>,
  document: StoredDocument | undefined,
  kind: ListedDocument['kind'],
  dateRaw: string | undefined
): void => {
  const urlId = documentIdFromUrl(document?.document_url);
  if (!urlId || documentsByUrlId.has(urlId)) {
    return;
  }
  documentsByUrlId.set(urlId, {
    id: urlId,
    urlId,
    name: document.document_filename,
    dateRaw: document.upload_timestamp || document.createdOn || dateRaw,
    kind,
  });
};

const applyDocumentCollection = (
  documentCollection: DocumentTypeItem[] | undefined,
  documentsByUrlId: Map<string, ListedDocument>,
  currentDocumentIds: Set<string>
): void => {
  documentCollection?.forEach(document => {
    const urlId = documentIdFromUrl(document?.value?.uploadedDocument?.document_url);
    if (!urlId || currentDocumentIds.has(urlId)) {
      return;
    }
    const existing = documentsByUrlId.get(urlId);
    if (existing) {
      existing.id = document.id || existing.id;
      existing.name = document.value?.uploadedDocument?.document_filename || existing.name;
      existing.dateRaw = firstDate(
        document.value?.dateOfCorrespondence,
        document.value?.creationDate,
        document.value?.uploadedDocument?.createdOn,
        existing.dateRaw
      );
      return;
    }
    if (isResponseAcceptedDocument(document)) {
      documentsByUrlId.set(urlId, {
        id: document.id || urlId,
        urlId,
        name: document.value?.uploadedDocument?.document_filename,
        dateRaw: firstDate(
          document.value?.dateOfCorrespondence,
          document.value?.creationDate,
          document.value?.uploadedDocument?.createdOn
        ),
        kind: 'accepted',
      });
    }
  });
};

const isResponseAcceptedDocument = (document: DocumentTypeItem): boolean => {
  const responseClaimDocuments = document?.value?.responseClaimDocuments;
  const typeOfDocument = document?.value?.typeOfDocument;
  const documentType = document?.value?.documentType;
  return (
    responseClaimDocuments === RESPONSE_ACCEPTED ||
    documentType === RESPONSE_ACCEPTED ||
    responseAcceptedDocTypes.includes(typeOfDocument) ||
    responseAcceptedDocTypes.includes(documentType)
  );
};

const collectRespondentDocumentIds = (respondent: RespondentET3Model | undefined): Set<string> => {
  const ids = new Set<string>();
  if (!respondent) {
    return ids;
  }
  [
    respondent.et3Form,
    respondent.et3FormWelsh,
    respondent.et3ResponseEmployerClaimDocument,
    respondent.et3ResponseRespondentSupportDocument,
  ].forEach(document => addDocumentId(ids, document?.document_url));
  respondent.et3ResponseContestClaimDocument?.forEach(document => {
    addDocumentId(ids, document?.value?.uploadedDocument?.document_url);
  });
  return ids;
};

const addDocumentId = (ids: Set<string>, url: string | undefined): void => {
  const id = documentIdFromUrl(url);
  if (StringUtils.isNotBlank(id)) {
    ids.add(id);
  }
};

const documentIdFromUrl = (url: string | undefined): string => {
  return DocumentUtils.findDocumentIdByURL(url);
};

const firstDate = (...dates: (string | undefined)[]): string | undefined => {
  return dates.find(date => StringUtils.isNotBlank(date));
};

const documentTime = (dateRaw: string | undefined): number => {
  if (!dateRaw || !DateUtils.isDateStringValid(dateRaw)) {
    return 0;
  }
  return Date.parse(dateRaw);
};

const toTableRow = (
  req: AppRequest,
  document: ListedDocument,
  labels: OtherRespondentEt3Labels
): TableCell[] | undefined => {
  if (StringUtils.isBlank(document.name) || StringUtils.isBlank(document.id)) {
    return undefined;
  }
  return [
    { text: formatDocumentDate(req, document.dateRaw) },
    { text: labelForKind(document.kind, labels) },
    {
      html:
        '<a href="/getCaseDocument/' +
        escapeHtml(document.id) +
        '" target="_blank" class="govuk-link">' +
        escapeHtml(document.name) +
        '</a>',
    },
  ];
};

const labelForKind = (kind: ListedDocument['kind'], labels: OtherRespondentEt3Labels): string => {
  if (kind === 'form') {
    return labels.et3FormText;
  }
  if (kind === 'attachment') {
    return labels.et3AttachmentText;
  }
  return labels.acceptanceLetter;
};

const formatDocumentDate = (req: AppRequest, dateRaw: string | undefined): string => {
  if (!dateRaw || !DateUtils.isDateStringValid(dateRaw)) {
    return '';
  }
  return dateInLocale(DateUtils.convertStringToDate(dateRaw), req.url);
};

const escapeHtml = (value: string): string => {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};
