import { Document } from './case';

/**
 * Represents the subset of MultipleData fields from et-ccd-callbacks that
 * are relevant to SYR.  Populated via GET /cases/multiple-case and stored as
 * req.session.multipleCase.
 */
export interface MultipleCaseData {
  id: string;
  multipleName?: string;
  multipleReference?: string;
  claimantContactDetailsDocument?: Document;
  claimantContactDetailsDocumentWelsh?: Document;
}
