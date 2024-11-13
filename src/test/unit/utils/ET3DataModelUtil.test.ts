import { CaseWithId, RespondentET3Model } from '../../../main/definitions/case';
import { RespondentType } from '../../../main/definitions/complexTypes/respondent';
import ET3DataModelUtil from '../../../main/utils/ET3DataModelUtil';
import {
  mockCaseWithIdForET3DataModelUtilConvertSelectedRespondentToRespondentTypeTest,
  mockCaseWithIdWithRespondents,
} from '../mocks/mockCaseWithId';
import { mockedRespondentType, mockedRespondentTypeWithoutCheckedFields } from '../mocks/mockRespondentType';

describe('ET3DataModelUtil tests', () => {
  const caseWithId: CaseWithId = mockCaseWithIdForET3DataModelUtilConvertSelectedRespondentToRespondentTypeTest;
  const selectedRespondent: RespondentET3Model = mockCaseWithIdWithRespondents.respondents[0];
  test('convertSelectedRespondentToRespondentType', () => {
    const respondentType: RespondentType = ET3DataModelUtil.convertSelectedRespondentToRespondentType(
      caseWithId,
      selectedRespondent
    );
    expect(respondentType).toEqual(mockedRespondentType);
  });
  test('convertSelectedRespondentToRespondentType without checked fields', () => {
    caseWithId.et3ResponseEmploymentStartDate = undefined;
    caseWithId.et3ResponseEmploymentEndDate = undefined;
    caseWithId.idamId = undefined;
    caseWithId.et3Status = undefined;
    caseWithId.et3CompanyHouseDocumentUrl = undefined;
    caseWithId.et3CompanyHouseDocumentBinaryUrl = undefined;
    caseWithId.et3IndividualInsolvencyDocumentBinaryUrl = undefined;
    caseWithId.et3IndividualInsolvencyDocumentUrl = undefined;
    caseWithId.et3VettingDocumentBinaryUrl = undefined;
    caseWithId.et3VettingDocumentUrl = undefined;
    caseWithId.et3ResponseEmployerClaimDocumentBinaryUrl = undefined;
    caseWithId.et3ResponseEmployerClaimDocumentUrl = undefined;
    caseWithId.et3ResponseRespondentSupportDocumentBinaryUrl = undefined;
    caseWithId.et3ResponseRespondentSupportDocument = undefined;
    caseWithId.et3FormBinaryUrl = undefined;
    caseWithId.et3FormUrl = undefined;
    caseWithId.et3FormWelshBinaryUrl = undefined;
    caseWithId.et3FormWelshUrl = undefined;
    const respondentType: RespondentType = ET3DataModelUtil.convertSelectedRespondentToRespondentType(
      caseWithId,
      selectedRespondent
    );
    expect(respondentType).toEqual(mockedRespondentTypeWithoutCheckedFields);
  });
});
