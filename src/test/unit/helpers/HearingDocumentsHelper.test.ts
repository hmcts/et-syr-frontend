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
      expect(radioButtons).toBeUndefined();
    });

    it('should return undefined if hearing status is not Listed even if date is in future', () => {
      collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2028-07-04T14:00:00.000');
      collection[0].value.hearingDateCollection[0].value.Hearing_status = 'Postponed';
      const radioButtons = createRadioBtnsForHearings(collection);
      expect(radioButtons).toBeUndefined();
    });

    it('should return undefined if hearing collection is empty', () => {
      expect(createRadioBtnsForHearings([])).toBeUndefined();
      expect(createRadioBtnsForHearings(undefined)).toBeUndefined();
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

    it('should return undefined when hearing has no date collection', () => {
      expect(createLabelForHearing(undefined as unknown as HearingModel)).toBeUndefined();
      expect(createLabelForHearing({ id: '1', value: {} } as HearingModel)).toBeUndefined();
      expect(createLabelForHearing({ id: '1', value: { hearingDateCollection: [] } } as HearingModel)).toBeUndefined();
    });

    it('should use Scotland venue when present and pick earliest future listed date', () => {
      collection[0].value.Hearing_venue_Scotland = 'Glasgow';
      collection[0].value.hearingDateCollection = [
        {
          id: 'later',
          value: {
            listedDate: new Date('2039-07-04T14:00:00.000'),
            Hearing_status: 'Listed',
            hearingTimingStart: new Date('2039-07-04T11:00:00.000'),
            hearingTimingFinish: new Date('2039-07-04T12:00:00.000'),
          },
        },
        {
          id: 'earlier',
          value: {
            listedDate: new Date('2038-01-04T14:00:00.000'),
            Hearing_status: 'Listed',
            hearingTimingStart: new Date('2038-01-04T11:00:00.000'),
            hearingTimingFinish: new Date('2038-01-04T12:00:00.000'),
          },
        },
      ];
      expect(createLabelForHearing(collection[0])).toEqual('3333 Hearing - Glasgow - 4 January 2038');
    });

    it('should fall back to empty venue and type when missing', () => {
      collection[0].value.hearingDateCollection[0].value.listedDate = new Date('2038-07-04T14:00:00.000');
      collection[0].value.Hearing_type = undefined;
      collection[0].value.Hearing_venue_Scotland = undefined;
      collection[0].value.Hearing_venue = undefined;
      expect(createLabelForHearing(collection[0])).toEqual('3333  -  - 4 July 2038');
    });
  });
});
