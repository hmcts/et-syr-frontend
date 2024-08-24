import { returnTranslatedDateString } from '../../../main/helpers/DateHelper';

const testDateStringValueForReturnTranslatedDateString: string = '2024-08-24T12:11:00.000';
const testLocaleStringForReturnTranslatedDateString: string = 'en-GB';
const testExpectedValueForReturnTranslatedDateString: string = '24 August 2024';

describe('Date Helper Test', () => {
  it('should set error when no case data returns', async () => {
    expect(
      returnTranslatedDateString(
        testDateStringValueForReturnTranslatedDateString,
        testLocaleStringForReturnTranslatedDateString
      )
    ).toEqual(testExpectedValueForReturnTranslatedDateString);
  });
});
