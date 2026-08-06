import { Document } from '../case';

/**
 * Shape of the CaseDetails response returned by GET /cases/multiple-case.
 * Mirrors the MultipleData fields that SYR needs from et-ccd-callbacks.
 */
export interface MultipleCaseApiResponse {
  id: string;
  state?: string;
  case_data?: MultipleCaseResponseData;
}

export interface MultipleCaseResponseData {
  multipleName?: string;
  multipleReference?: string;
  claimantContactDetailsDocument?: Document;
  claimantContactDetailsDocumentWelsh?: Document;
}
