import { GenericConstants } from '../../../main/definitions/constants';
import {
  BirthDateFormFields,
  DateValues,
  EndDateFormFields,
  NewJobDateFormFields,
  NoticeEndDateFormFields,
  StartDateFormFields,
} from '../../../main/definitions/dates';
import { DateValuesTestConstants } from '../../../main/definitions/definitions.constants';

describe('DatesModelTest', () => {
  describe('DateValues', () => {
    it('check DateValues constant', () => {
      expect(DateValues).toHaveLength(DateValuesTestConstants.LENGTH);
      expect(DateValues[0].name).toBe(DateValuesTestConstants.DAY);
      expect(DateValues[0].classes).toBe(GenericConstants.CLASS_GOV_UK_INPUT_WIDTH_2);
      expect(DateValues[0].attributes).toEqual(GenericConstants.ATTRIBUTE_MAX_LENGTH_2);
      expect(DateValues[1].name).toBe(DateValuesTestConstants.MONTH);
      expect(DateValues[1].classes).toBe(GenericConstants.CLASS_GOV_UK_INPUT_WIDTH_2);
      expect(DateValues[1].attributes).toEqual(GenericConstants.ATTRIBUTE_MAX_LENGTH_2);
      expect(DateValues[2].name).toBe(DateValuesTestConstants.YEAR);
      expect(DateValues[2].classes).toBe(GenericConstants.CLASS_GOV_UK_INPUT_WIDTH_4);
      expect(DateValues[2].attributes).toEqual(GenericConstants.ATTRIBUTE_MAX_LENGTH_4);
    });
  });

  describe('BirthDateFormFields', () => {
    it('check BirthDateFormFields constant', () => {
      expect(BirthDateFormFields.classes).toBe(GenericConstants.CLASS_GOV_UK_DATE_INPUT);
      expect(BirthDateFormFields.type).toBe(GenericConstants.TYPE_DATE);
      expect(BirthDateFormFields.labelHidden).toEqual(GenericConstants.FALSE);
      expect(BirthDateFormFields.labelSize).toEqual(GenericConstants.LABEL_SIZE_LARGE);
      expect(BirthDateFormFields.values).toEqual(DateValues);
    });
  });

  describe('EndDateFormFields', () => {
    it('check EndDateFormFields constant', () => {
      expect(EndDateFormFields.classes).toBe(GenericConstants.CLASS_GOV_UK_DATE_INPUT);
      expect(EndDateFormFields.type).toBe(GenericConstants.TYPE_DATE);
      expect(EndDateFormFields.labelHidden).toEqual(GenericConstants.FALSE);
      expect(EndDateFormFields.labelSize).toEqual(GenericConstants.LABEL_SIZE_LARGE);
      expect(EndDateFormFields.values).toEqual(DateValues);
    });
  });

  describe('NewJobDateFormFields', () => {
    it('check NewJobDateFormFields constant', () => {
      expect(NewJobDateFormFields.classes).toBe(GenericConstants.CLASS_GOV_UK_DATE_INPUT);
      expect(NewJobDateFormFields.type).toBe(GenericConstants.TYPE_DATE);
      expect(NewJobDateFormFields.labelHidden).toEqual(GenericConstants.FALSE);
      expect(NewJobDateFormFields.labelSize).toEqual(GenericConstants.LABEL_SIZE_LARGE);
      expect(NewJobDateFormFields.values).toEqual(DateValues);
    });
  });

  describe('NoticeEndDateFormFields', () => {
    it('check NoticeEndDateFormFields constant', () => {
      expect(NoticeEndDateFormFields.classes).toBe(GenericConstants.CLASS_GOV_UK_DATE_INPUT);
      expect(NoticeEndDateFormFields.type).toBe(GenericConstants.TYPE_DATE);
      expect(NoticeEndDateFormFields.labelHidden).toEqual(GenericConstants.FALSE);
      expect(NoticeEndDateFormFields.labelSize).toEqual(GenericConstants.LABEL_SIZE_LARGE);
      expect(NoticeEndDateFormFields.values).toEqual(DateValues);
    });
  });

  describe('StartDateFormFields', () => {
    it('check StartDateFormFields constant', () => {
      expect(StartDateFormFields.classes).toBe(GenericConstants.CLASS_GOV_UK_DATE_INPUT);
      expect(StartDateFormFields.type).toBe(GenericConstants.TYPE_DATE);
      expect(StartDateFormFields.labelHidden).toEqual(GenericConstants.FALSE);
      expect(StartDateFormFields.labelSize).toEqual(GenericConstants.LABEL_SIZE_LARGE);
      expect(StartDateFormFields.values).toEqual(DateValues);
    });
  });
});
