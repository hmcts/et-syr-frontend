import { HearingModel } from '../../../main/definitions/api/caseApiResponse';
import { createLabelForHearing, createRadioBtnsForHearings } from '../../../main/helpers/HearingDocumentsHelper';
import { mockHearingCollection } from '../mocks/mockHearing';

describe('HearingDocumentsHelper', () => {
  let collection: HearingModel[] = [];

  beforeEach(() => {
    collection = JSON.parse(JSON.stringify(mockHearingCollection));
  });

  describe('createRadioBtnsForHearings', () => {
    it('should return a label, name and value for each hearing', () => {
      const radioButtons = createRadioBtnsForHearings(collection);
      expect(radioButtons[0]).toEqual(
        expect.objectContaining({
          label: expect.any(String),
          name: 'hearingDocumentsAreFor',
          value: mockHearingCollection[0].id,
        })
      );
    });

    it('should return undefined if no hearings are present for future dates', () => {
      collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2022-07-04T14:00:00.000');
      const radioButtons = createRadioBtnsForHearings(collection);
      expect(radioButtons).toEqual(undefined);
    });

    it('should return undefined if hearing status is not Listed even if date is in future', () => {
      collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2028-07-04T14:00:00.000');
      collection[0].value.hearingDateCollection[0].value.Hearing_status = 'Postponed';
      const radioButtons = createRadioBtnsForHearings(collection);
      expect(radioButtons).toEqual(undefined);
    });

    it('should return undefined if hearing collection is empty', () => {
      expect(createRadioBtnsForHearings([])).toEqual(undefined);
      expect(createRadioBtnsForHearings(undefined)).toEqual(undefined);
    });
  });

  describe('createLabelForHearing', () => {
    it('should return a label with hearing number, hearing type, location and formatted date', () => {
      collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2038-07-04T14:00:00.000');
      const label = createLabelForHearing(collection[0]);
      expect(label).toEqual('3333 Hearing - RCJ - 4 July 2038');
    });

    it('should not return the hearing number if undefined', () => {
      collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2038-07-04T14:00:00.000');
      collection[0].value.hearingNumber = undefined;
      const label = createLabelForHearing(collection[0]);
      expect(label).toEqual(' Hearing - RCJ - 4 July 2038');
    });
  });
});
