import { WeeksOrMonths, YesOrNo } from '../../../../main/definitions/case';
import { AnyRecord } from '../../../../main/definitions/util-types';
import { getNoticePeriod, getWrittenContract } from '../../../../main/helpers/controller/ClaimantNoticePeriodHelper';
import claimantNoticePeriodJson from '../../../../main/resources/locales/en/translation/claimant-notice-period.json';
import commonJson from '../../../../main/resources/locales/en/translation/common.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

const translations: AnyRecord = {
  ...commonJson,
  ...claimantNoticePeriodJson,
};
describe('getWrittenContract', () => {
  it('should return "Yes" when notice period is YesOrNo.YES', () => {
    const req = mockRequestWithTranslation({}, translations);
    req.session.userCase.noticePeriod = YesOrNo.YES;
    expect(getWrittenContract(req)).toBe('Yes');
  });

  it('should return "No" when notice period is YesOrNo.NO', () => {
    const req = mockRequestWithTranslation({}, translations);
    req.session.userCase.noticePeriod = YesOrNo.NO;
    expect(getWrittenContract(req)).toBe('No');
  });

  it('should return "Not Provided" when notice period is undefined', () => {
    const req = mockRequestWithTranslation({}, translations);
    expect(getWrittenContract(req)).toBe('Not provided');
  });

  it('should return "Not Provided" when userCase is undefined', () => {
    const req = mockRequestWithTranslation({}, translations);
    req.session.userCase.noticePeriod = undefined;
    expect(getWrittenContract(req)).toBe('Not provided');
  });
});

describe('getNoticePeriod', () => {
  it('should return correct translation for months when length is 3', () => {
    const req = mockRequestWithTranslation({}, translations);
    req.session.userCase.noticePeriodLength = '3';
    req.session.userCase.noticePeriodUnit = WeeksOrMonths.MONTHS;
    expect(getNoticePeriod(req)).toBe('3 Months');
  });

  it('should return correct translation for months when length is 2', () => {
    const req = mockRequestWithTranslation({}, translations);
    req.session.userCase.noticePeriodLength = '2';
    req.session.userCase.noticePeriodUnit = WeeksOrMonths.MONTHS;
    expect(getNoticePeriod(req)).toBe('2 Months');
  });

  it('should return correct translation for months when length is 1', () => {
    const req = mockRequestWithTranslation({}, translations);
    req.session.userCase.noticePeriodLength = '1';
    req.session.userCase.noticePeriodUnit = WeeksOrMonths.MONTHS;
    expect(getNoticePeriod(req)).toBe('1 Month');
  });

  it('should return correct translation for weeks', () => {
    const req = mockRequestWithTranslation({}, translations);
    req.session.userCase.noticePeriodLength = '3';
    req.session.userCase.noticePeriodUnit = WeeksOrMonths.WEEKS;
    expect(getNoticePeriod(req)).toBe('3 Weeks');
  });

  it('should return "Not Provided" when length is undefined', () => {
    const req = mockRequestWithTranslation({}, translations);
    req.session.userCase.noticePeriodLength = undefined;
    req.session.userCase.noticePeriodUnit = WeeksOrMonths.WEEKS;
    expect(getNoticePeriod(req)).toBe('Not provided');
  });

  it('should return "Not Provided" when unit is undefined', () => {
    const req = mockRequestWithTranslation({}, translations);
    req.session.userCase.noticePeriodLength = '3';
    req.session.userCase.noticePeriodUnit = undefined;
    expect(getNoticePeriod(req)).toBe('Not provided');
  });

  it('should return "Not Provided" when both length and unit are undefined', () => {
    const req = mockRequestWithTranslation({}, translations);
    req.session.userCase.noticePeriodLength = undefined;
    req.session.userCase.noticePeriodUnit = undefined;
    expect(getNoticePeriod(req)).toBe('Not provided');
  });
});
