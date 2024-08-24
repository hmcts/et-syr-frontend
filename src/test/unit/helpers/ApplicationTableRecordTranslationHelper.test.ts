import { clone } from 'lodash';

import { AnyRecord } from '../../../main/definitions/util-types';
import {
  retrieveCurrentLocale,
  translateOverallStatus,
  translateTypesOfClaims,
} from '../../../main/helpers/ApplicationTableRecordTranslationHelper';
import { mockApplicationWithAllTypeOfClaims } from '../mocks/mockApplicationWithAllTypeOfClaims';
import { mockWelshClaimTypesTranslations } from '../mocks/mockTranslations';

const URL_STRING_VALUE_ENGLISH = '/dummy-url?lng=en';
const URL_STRING_VALUE_WELSH = '/dummy-url?lng=cy';
const CURRENT_LOCALE_ENGLAND = 'en-GB';
const CURRENT_LOCALE_WALES = 'cy';
const mockOverallStatusForTranslateOverallStatus: AnyRecord = {
  sectionCount: 1,
  totalSections: 4,
};
const mockTranslationsForTranslateOverallStatus: AnyRecord = {
  of: 'of',
  tasksCompleted: 'tasksCompleted',
};

const mockOverallStatusExceptedValueForTranslateOverallStatus =
  mockOverallStatusForTranslateOverallStatus.sectionCount +
  ' ' +
  mockTranslationsForTranslateOverallStatus.of +
  ' ' +
  mockOverallStatusForTranslateOverallStatus.totalSections +
  ' ' +
  mockTranslationsForTranslateOverallStatus.tasksCompleted;

const expectedTypeOfClaimsTranslationsForTranslateTypeOfClaims: string =
  'Torri contract,Gwahaniaethu,Ymwneud â thâl,Diswyddo annheg,Chwythu’r chwiban,Math arall o hawliad';

describe('Retrieves current locale by url', () => {
  it('should retrieve current locale as en-GB when url does not have ?lng=cy', () => {
    expect(retrieveCurrentLocale(URL_STRING_VALUE_ENGLISH)).toEqual(CURRENT_LOCALE_ENGLAND);
  });
  it('should retrieve current locale as cy when url has ?lng=cy', () => {
    expect(retrieveCurrentLocale(URL_STRING_VALUE_WELSH)).toEqual(CURRENT_LOCALE_WALES);
  });
  it('should retrieve current locale as en-GB when url is undefined', () => {
    expect(retrieveCurrentLocale(undefined)).toEqual(CURRENT_LOCALE_ENGLAND);
  });
});

describe('Translates overall status', () => {
  it('should overall status by given status and translations records', () => {
    expect(
      translateOverallStatus(mockOverallStatusForTranslateOverallStatus, mockTranslationsForTranslateOverallStatus)
    ).toEqual(mockOverallStatusExceptedValueForTranslateOverallStatus);
  });
});

describe('Translates type of claims', () => {
  it('should translate type of claims when typeOfClaim exists', () => {
    translateTypesOfClaims(mockApplicationWithAllTypeOfClaims, mockWelshClaimTypesTranslations);
    expect(mockApplicationWithAllTypeOfClaims.userCase.typeOfClaim.toString()).toEqual(
      expectedTypeOfClaimsTranslationsForTranslateTypeOfClaims
    );
  });
  it('should not translate type of claims when typeOfClaim not exists', () => {
    const applicationTableRecordWithoutTypeOfClaim = clone(mockApplicationWithAllTypeOfClaims);
    applicationTableRecordWithoutTypeOfClaim.userCase.typeOfClaim = undefined;
    translateTypesOfClaims(applicationTableRecordWithoutTypeOfClaim, mockWelshClaimTypesTranslations);
    expect(mockApplicationWithAllTypeOfClaims.userCase.typeOfClaim).toEqual(undefined);
  });
});
