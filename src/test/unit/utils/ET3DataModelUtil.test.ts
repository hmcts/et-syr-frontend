import { CaseWithId, RespondentET3Model } from '../../../main/definitions/case';
import { RespondentType } from '../../../main/definitions/complexTypes/respondent';
import ET3DataModelUtil from '../../../main/utils/ET3DataModelUtil';
import {
  mockCaseWithIdForET3DataModelUtilConvertSelectedRespondentToRespondentTypeTest,
  mockCaseWithIdWithRespondents,
} from '../mocks/mockCaseWithId';
import { mockedRespondentType } from '../mocks/mockRespondentType';

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
});
