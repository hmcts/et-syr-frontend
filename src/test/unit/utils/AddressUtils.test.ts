import _ from 'lodash';

import { CaseWithId, RespondentET3Model, YesOrNo } from '../../../main/definitions/case';
import { Et1Address } from '../../../main/definitions/complexTypes/et1Address';
import AddressUtils from '../../../main/utils/AddressUtils';
import {
  mockValidCaseWithId,
  mockValidCaseWithIdWithResponseRespondentAddress,
  mockValidCaseWithIdWithResponseRespondentAddressFields,
} from '../mocks/mockCaseWithId';
import {
  mockRespondentET3ModelWithRespondentAddress,
  mockRespondentET3ModelWithRespondentAddressFields,
  mockRespondentET3ModelWithResponseRespondentAddress,
  mockRespondentET3ModelWithResponseRespondentAddressFields,
  mockRespondentET3ModelWithoutAddress,
} from '../mocks/mockRespondentET3Model';

describe('AddressUtils tests', () => {
  describe('findExistingRespondentAddress tests', () => {
    const expectedResponseRespondentAddress: Et1Address = {
      Country: 'England',
      PostCode: 'SL6 2DE',
      PostTown: 'Maidenhead',
      County: 'Berkshire',
      AddressLine1: '48, Tithe Barn Drive',
      AddressLine2: '49, Tithe Barn Drive',
      AddressLine3: '50, Tithe Barn Drive',
    };
    test('should return undefined when selected respondent is undefined', () => {
      expect(AddressUtils.findExistingRespondentAddress(undefined)).toStrictEqual(undefined);
    });
    test('should return undefined when selected respondent does not have any existing address', () => {
      const selectedRespondent: RespondentET3Model = _.cloneDeep(mockRespondentET3ModelWithoutAddress);
      expect(AddressUtils.findExistingRespondentAddress(selectedRespondent)).toStrictEqual(undefined);
    });
    test('should return a valid address when selected respondent has existing address', () => {
      const selectedRespondent: RespondentET3Model = _.cloneDeep(mockRespondentET3ModelWithRespondentAddress);
      expect(AddressUtils.findExistingRespondentAddress(selectedRespondent)).toStrictEqual(
        expectedResponseRespondentAddress
      );
    });
    test('should return a valid address when selected respondent has existing address fields', () => {
      const selectedRespondent: RespondentET3Model = _.cloneDeep(mockRespondentET3ModelWithRespondentAddressFields);
      expect(AddressUtils.findExistingRespondentAddress(selectedRespondent)).toStrictEqual(
        expectedResponseRespondentAddress
      );
    });
  });
  describe('findResponseRespondentAddress tests', () => {
    const expectedResponseRespondentAddress: Et1Address = {
      Country: 'England',
      PostCode: 'SL6 2DE',
      PostTown: 'Maidenhead',
      County: 'Berkshire',
      AddressLine1: '48, Tithe Barn Drive',
      AddressLine2: '49, Tithe Barn Drive',
      AddressLine3: '50, Tithe Barn Drive',
    };
    test('should return undefined when selected respondent and user case are undefined', () => {
      expect(AddressUtils.findResponseRespondentAddress(undefined, undefined)).toStrictEqual(undefined);
    });
    test('should return undefined when selected respondent and user case does not have any response respondent address', () => {
      const userCase: CaseWithId = _.cloneDeep(mockValidCaseWithId);
      const selectedRespondent: RespondentET3Model = _.cloneDeep(mockRespondentET3ModelWithoutAddress);
      expect(AddressUtils.findResponseRespondentAddress(userCase, selectedRespondent)).toStrictEqual(undefined);
    });
    test('should return a valid address when user case has response respondent address', () => {
      const userCase: CaseWithId = _.cloneDeep(mockValidCaseWithIdWithResponseRespondentAddress);
      const selectedRespondent: RespondentET3Model = _.cloneDeep(mockRespondentET3ModelWithoutAddress);
      expect(AddressUtils.findResponseRespondentAddress(userCase, selectedRespondent)).toStrictEqual(
        expectedResponseRespondentAddress
      );
    });
    test('should return a valid address when user case has response respondent address fields', () => {
      const userCase: CaseWithId = _.cloneDeep(mockValidCaseWithIdWithResponseRespondentAddressFields);
      const selectedRespondent: RespondentET3Model = _.cloneDeep(mockRespondentET3ModelWithoutAddress);
      expect(AddressUtils.findResponseRespondentAddress(userCase, selectedRespondent)).toStrictEqual(
        expectedResponseRespondentAddress
      );
    });
    test('should return a valid address when selected respondent has response respondent address', () => {
      const userCase: CaseWithId = _.cloneDeep(mockValidCaseWithId);
      const selectedRespondent: RespondentET3Model = _.cloneDeep(mockRespondentET3ModelWithResponseRespondentAddress);
      expect(AddressUtils.findResponseRespondentAddress(userCase, selectedRespondent)).toStrictEqual(
        expectedResponseRespondentAddress
      );
    });
    test('should return a valid address when selected respondent has response respondent address fields', () => {
      const userCase: CaseWithId = _.cloneDeep(mockValidCaseWithId);
      const selectedRespondent: RespondentET3Model = _.cloneDeep(
        mockRespondentET3ModelWithResponseRespondentAddressFields
      );
      expect(AddressUtils.findResponseRespondentAddress(userCase, selectedRespondent)).toStrictEqual(
        expectedResponseRespondentAddress
      );
    });
  });
  describe('findResponseRespondentAddressByEt3IsRespondentAddressCorrectField tests', () => {
    const expectedResponseRespondentAddress: Et1Address = {
      Country: 'England',
      PostCode: 'SL6 2DE',
      PostTown: 'Maidenhead',
      County: 'Berkshire',
      AddressLine1: '48, Tithe Barn Drive',
      AddressLine2: '49, Tithe Barn Drive',
      AddressLine3: '50, Tithe Barn Drive',
    };
    test('should return existing address when existing respondent address is correct', () => {
      const userCase: CaseWithId = _.cloneDeep(mockValidCaseWithId);
      userCase.et3IsRespondentAddressCorrect = YesOrNo.YES;
      const selectedRespondent: RespondentET3Model = _.cloneDeep(mockRespondentET3ModelWithRespondentAddress);
      expect(
        AddressUtils.findResponseRespondentAddressByEt3IsRespondentAddressCorrectField(userCase, selectedRespondent)
      ).toStrictEqual(expectedResponseRespondentAddress);
    });
    test('should return respondent response address when existing respondent address is not correct', () => {
      const userCase: CaseWithId = _.cloneDeep(mockValidCaseWithId);
      userCase.et3IsRespondentAddressCorrect = YesOrNo.NO;
      const selectedRespondent: RespondentET3Model = _.cloneDeep(mockRespondentET3ModelWithResponseRespondentAddress);
      expect(
        AddressUtils.findResponseRespondentAddressByEt3IsRespondentAddressCorrectField(userCase, selectedRespondent)
      ).toStrictEqual(expectedResponseRespondentAddress);
    });
  });
});
