import { CaseTypeId } from '../../../../main/definitions/case';
import { PageUrls } from '../../../../main/definitions/constants';
import { CuiYourSupportFeature } from '../../../../main/modules/featureFlag/CuiYourSupportFeature';

describe('CuiYourSupportFeature', () => {
  it('disables all case types when the enabled case type list is empty', () => {
    const feature = new CuiYourSupportFeature([]);

    expect(feature.isEnabled(CaseTypeId.SCOTLAND)).toBe(false);
    expect(feature.isEnabled(CaseTypeId.ENGLAND_WALES)).toBe(false);
  });

  it('enables Scotland only when ET_Scotland is configured', () => {
    const feature = new CuiYourSupportFeature([CaseTypeId.SCOTLAND]);

    expect(feature.isEnabled(CaseTypeId.SCOTLAND)).toBe(true);
    expect(feature.isEnabled(CaseTypeId.ENGLAND_WALES)).toBe(false);
  });

  it('returns the CUI support URL for Scotland and the legacy URL for England and Wales', () => {
    const feature = new CuiYourSupportFeature([CaseTypeId.SCOTLAND]);

    expect(feature.getSupportPageUrl(CaseTypeId.SCOTLAND)).toBe(PageUrls.YOUR_SUPPORT);
    expect(feature.getSupportPageUrl(CaseTypeId.ENGLAND_WALES)).toBe(PageUrls.REASONABLE_ADJUSTMENTS);
  });
});
