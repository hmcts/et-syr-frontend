import _ from 'lodash';

import { CaseWithId, RespondentET3Model, YesOrNo } from '../../../main/definitions/case';
import { Et1Address } from '../../../main/definitions/complexTypes/et1Address';
import { RespondentType } from '../../../main/definitions/complexTypes/respondent';
import ET3DataModelUtil from '../../../main/utils/ET3DataModelUtil';
import {
  mockCaseWithIdForET3DataModelUtilConvertSelectedRespondentToRespondentTypeTest,
  mockCaseWithIdWithRespondents,
  mockValidCaseWithId,
} from '../mocks/mockCaseWithId';
import {
  mockRespondentET3ModelWithRespondentAddress,
  mockRespondentET3ModelWithResponseRespondentAddress,
  mockRespondentET3ModelWithoutAddress,
} from '../mocks/mockRespondentET3Model';
import { mockedRespondentType, mockedRespondentTypeWithoutCheckedFields } from '../mocks/mockRespondentType';

describe('ET3DataModelUtil tests', () => {
  describe('convertCaseWithIdToET3Request tests', () => {
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
  describe('setResponseRespondentAddress tests', () => {
    const selectedUserWithoutAddress: RespondentET3Model = _.cloneDeep(mockRespondentET3ModelWithoutAddress);
    const selectedUserWithResponseRespondentAddress: RespondentET3Model = _.cloneDeep(
      mockRespondentET3ModelWithResponseRespondentAddress
    );
    const selectedUserWithRespondentAddress: RespondentET3Model = _.cloneDeep(
      mockRespondentET3ModelWithRespondentAddress
    );
    const expectedResponseRespondentAddress: Et1Address = {
      Country: 'England',
      PostCode: 'SL6 2DE',
      PostTown: 'Maidenhead',
      County: 'Berkshire',
      AddressLine1: '48, Tithe Barn Drive',
      AddressLine2: '49, Tithe Barn Drive',
      AddressLine3: '50, Tithe Barn Drive',
    };
    const areAddressFieldsUndefined = (userCase: CaseWithId, selectedRespondent: RespondentET3Model): boolean => {
      expect(userCase.responseRespondentAddress).toStrictEqual(undefined);
      expect(userCase.responseRespondentAddressCountry).toStrictEqual(undefined);
      expect(userCase.responseRespondentAddressPostCode).toStrictEqual(undefined);
      expect(userCase.responseRespondentAddressPostTown).toStrictEqual(undefined);
      expect(userCase.responseRespondentAddressCounty).toStrictEqual(undefined);
      expect(userCase.responseRespondentAddressLine1).toStrictEqual(undefined);
      expect(userCase.responseRespondentAddressLine2).toStrictEqual(undefined);
      expect(userCase.responseRespondentAddressLine3).toStrictEqual(undefined);
      expect(selectedRespondent.responseRespondentAddress).toStrictEqual(undefined);
      expect(selectedRespondent.responseRespondentAddressCountry).toStrictEqual(undefined);
      expect(selectedRespondent.responseRespondentAddressPostCode).toStrictEqual(undefined);
      expect(selectedRespondent.responseRespondentAddressPostTown).toStrictEqual(undefined);
      expect(selectedRespondent.responseRespondentAddressCounty).toStrictEqual(undefined);
      expect(selectedRespondent.responseRespondentAddressLine1).toStrictEqual(undefined);
      expect(selectedRespondent.responseRespondentAddressLine2).toStrictEqual(undefined);
      expect(selectedRespondent.responseRespondentAddressLine3).toStrictEqual(undefined);
      return true;
    };
    const areAddressFieldsMatchWithExpectedValues = (
      userCase: CaseWithId,
      selectedRespondent: RespondentET3Model
    ): boolean => {
      expect(userCase.responseRespondentAddress).toStrictEqual(expectedResponseRespondentAddress);
      expect(userCase.responseRespondentAddressCountry).toStrictEqual(expectedResponseRespondentAddress.Country);
      expect(userCase.responseRespondentAddressPostCode).toStrictEqual(expectedResponseRespondentAddress.PostCode);
      expect(userCase.responseRespondentAddressPostTown).toStrictEqual(expectedResponseRespondentAddress.PostTown);
      expect(userCase.responseRespondentAddressCounty).toStrictEqual(expectedResponseRespondentAddress.County);
      expect(userCase.responseRespondentAddressLine1).toStrictEqual(expectedResponseRespondentAddress.AddressLine1);
      expect(userCase.responseRespondentAddressLine2).toStrictEqual(expectedResponseRespondentAddress.AddressLine2);
      expect(userCase.responseRespondentAddressLine3).toStrictEqual(expectedResponseRespondentAddress.AddressLine3);
      expect(selectedRespondent.responseRespondentAddress).toStrictEqual(expectedResponseRespondentAddress);
      expect(selectedRespondent.responseRespondentAddressCountry).toStrictEqual(
        expectedResponseRespondentAddress.Country
      );
      expect(selectedRespondent.responseRespondentAddressPostCode).toStrictEqual(
        expectedResponseRespondentAddress.PostCode
      );
      expect(selectedRespondent.responseRespondentAddressPostTown).toStrictEqual(
        expectedResponseRespondentAddress.PostTown
      );
      expect(selectedRespondent.responseRespondentAddressCounty).toStrictEqual(
        expectedResponseRespondentAddress.County
      );
      expect(selectedRespondent.responseRespondentAddressLine1).toStrictEqual(
        expectedResponseRespondentAddress.AddressLine1
      );
      expect(selectedRespondent.responseRespondentAddressLine2).toStrictEqual(
        expectedResponseRespondentAddress.AddressLine2
      );
      expect(selectedRespondent.responseRespondentAddressLine3).toStrictEqual(
        expectedResponseRespondentAddress.AddressLine3
      );
      return true;
    };
    test('should not set any address when respondent address is not correct and there is no address found', () => {
      const userCase: CaseWithId = _.cloneDeep(mockValidCaseWithId);
      userCase.et3IsRespondentAddressCorrect = YesOrNo.NO;
      const selectedRespondent: RespondentET3Model = _.cloneDeep(selectedUserWithoutAddress);
      ET3DataModelUtil.setResponseRespondentAddress(userCase, selectedRespondent);
      expect(areAddressFieldsUndefined(userCase, selectedRespondent)).toStrictEqual(true);
    });
    test('should not set any address when respondent address is correct and there is no address found', () => {
      const userCase: CaseWithId = _.cloneDeep(mockValidCaseWithId);
      userCase.et3IsRespondentAddressCorrect = YesOrNo.YES;
      const selectedRespondent: RespondentET3Model = _.cloneDeep(selectedUserWithoutAddress);
      ET3DataModelUtil.setResponseRespondentAddress(userCase, selectedRespondent);
      expect(areAddressFieldsUndefined(userCase, selectedRespondent)).toStrictEqual(true);
    });
    test('should set response respondent address to both user case and selected user when there is response respondent address in selected user and response respondent address is not correct', () => {
      const userCase: CaseWithId = _.cloneDeep(mockValidCaseWithId);
      userCase.et3IsRespondentAddressCorrect = YesOrNo.NO;
      const selectedRespondent: RespondentET3Model = _.cloneDeep(selectedUserWithResponseRespondentAddress);
      ET3DataModelUtil.setResponseRespondentAddress(userCase, selectedRespondent);
      expect(areAddressFieldsMatchWithExpectedValues(userCase, selectedRespondent)).toStrictEqual(true);
    });
    test('should set response respondent address to both user case and selected user when there is respondent address in selected user and response respondent address is correct', () => {
      const userCase: CaseWithId = _.cloneDeep(mockValidCaseWithId);
      userCase.et3IsRespondentAddressCorrect = YesOrNo.YES;
      const selectedRespondent: RespondentET3Model = _.cloneDeep(selectedUserWithRespondentAddress);
      ET3DataModelUtil.setResponseRespondentAddress(userCase, selectedRespondent);
      expect(areAddressFieldsMatchWithExpectedValues(userCase, selectedRespondent)).toStrictEqual(true);
    });
  });
});
