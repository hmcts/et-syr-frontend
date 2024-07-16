import { GenericConstants } from '../../../main/definitions/constants';
import {
  BirthDateFormFields,
  DateValues,
  EndDateFormFields,
  NewJobDateFormFields,
  NoticeEndDateFormFields,
  StartDateFormFields,
} from '../../../main/definitions/dates';
import {
  BirthDateFormFieldsTestConstants,
  DateValuesTestConstants,
  EndDateFormFieldsTestConstants,
  NewJobDateFormFieldsTestConstants,
  NoticeEndDateFormFieldsTestConstants,
  StartDateFormFieldsTestConstants,
} from '../../../main/definitions/definitions.constants';

describe('DatesModelTest', () => {
  describe('DateValues', () => {
    it('check DateValues constant', () => {
      expect(DateValues).toHaveLength(DateValuesTestConstants.LENGTH);
      expect(DateValues[0].name).toBe(DateValuesTestConstants.DAY);
      expect(DateValues[0].label.prototype).toEqual(DateValuesTestConstants.TRANSLATION_FUNCTION_LABEL_DAY.prototype);
      expect(DateValues[0].classes).toBe(GenericConstants.CLASS_GOV_UK_INPUT_WIDTH_2);
      expect(DateValues[0].attributes).toEqual(GenericConstants.ATTRIBUTE_MAX_LENGTH_2);
      expect(DateValues[1].name).toBe(DateValuesTestConstants.MONTH);
      expect(DateValues[1].label.prototype).toEqual(DateValuesTestConstants.TRANSLATION_FUNCTION_LABEL_MONTH.prototype);
      expect(DateValues[1].classes).toBe(GenericConstants.CLASS_GOV_UK_INPUT_WIDTH_2);
      expect(DateValues[1].attributes).toEqual(GenericConstants.ATTRIBUTE_MAX_LENGTH_2);
      expect(DateValues[2].name).toBe(DateValuesTestConstants.YEAR);
      expect(DateValues[2].label.prototype).toEqual(DateValuesTestConstants.TRANSLATION_FUNCTION_LABEL_YEAR.prototype);
      expect(DateValues[2].classes).toBe(GenericConstants.CLASS_GOV_UK_INPUT_WIDTH_4);
      expect(DateValues[2].attributes).toEqual(GenericConstants.ATTRIBUTE_MAX_LENGTH_4);
    });
  });

  describe('BirthDateFormFields', () => {
    it('check BirthDateFormFields constant', () => {
      expect(BirthDateFormFields.classes).toBe(GenericConstants.CLASS_GOV_UK_DATE_INPUT);
      expect(BirthDateFormFields.type).toBe(GenericConstants.TYPE_DATE);
      expect(BirthDateFormFields.label.prototype).toEqual(GenericConstants.TRANSLATION_FUNCTION_LABEL_LEGEND.prototype);
      expect(BirthDateFormFields.labelHidden).toEqual(GenericConstants.FALSE);
      expect(BirthDateFormFields.labelSize).toEqual(GenericConstants.LABEL_SIZE_LARGE);
      expect(BirthDateFormFields.hint.prototype).toEqual(GenericConstants.TRANSLATION_FUNCTION_LABEL_HINT.prototype);
      expect(BirthDateFormFields.values).toEqual(DateValues);
      expect(BirthDateFormFields.validator.prototype).toEqual(
        BirthDateFormFieldsTestConstants.VALIDATOR_FUNCTION.prototype
      );
    });
  });

  describe('EndDateFormFields', () => {
    it('check EndDateFormFields constant', () => {
      expect(EndDateFormFields.classes).toBe(GenericConstants.CLASS_GOV_UK_DATE_INPUT);
      expect(EndDateFormFields.type).toBe(GenericConstants.TYPE_DATE);
      expect(EndDateFormFields.label.prototype).toEqual(GenericConstants.TRANSLATION_FUNCTION_LABEL_LEGEND.prototype);
      expect(EndDateFormFields.labelHidden).toEqual(GenericConstants.FALSE);
      expect(EndDateFormFields.labelSize).toEqual(GenericConstants.LABEL_SIZE_LARGE);
      expect(EndDateFormFields.hint.prototype).toEqual(GenericConstants.TRANSLATION_FUNCTION_LABEL_HINT.prototype);
      expect(EndDateFormFields.values).toEqual(DateValues);
      expect(EndDateFormFields.validator.prototype).toEqual(
        EndDateFormFieldsTestConstants.VALIDATOR_FUNCTION.prototype
      );
    });
  });

  describe('NewJobDateFormFields', () => {
    it('check NewJobDateFormFields constant', () => {
      expect(NewJobDateFormFields.classes).toBe(GenericConstants.CLASS_GOV_UK_DATE_INPUT);
      expect(NewJobDateFormFields.type).toBe(GenericConstants.TYPE_DATE);
      expect(NewJobDateFormFields.label.prototype).toEqual(
        GenericConstants.TRANSLATION_FUNCTION_LABEL_LEGEND.prototype
      );
      expect(NewJobDateFormFields.labelHidden).toEqual(GenericConstants.FALSE);
      expect(NewJobDateFormFields.labelSize).toEqual(GenericConstants.LABEL_SIZE_LARGE);
      expect(NewJobDateFormFields.values).toEqual(DateValues);
      expect(NewJobDateFormFields.validator.prototype).toEqual(
        NewJobDateFormFieldsTestConstants.VALIDATOR_FUNCTION.prototype
      );
    });
  });

  describe('NoticeEndDateFormFields', () => {
    it('check NoticeEndDateFormFields constant', () => {
      expect(NoticeEndDateFormFields.classes).toBe(GenericConstants.CLASS_GOV_UK_DATE_INPUT);
      expect(NoticeEndDateFormFields.type).toBe(GenericConstants.TYPE_DATE);
      expect(NoticeEndDateFormFields.label.prototype).toEqual(
        GenericConstants.TRANSLATION_FUNCTION_LABEL_LEGEND.prototype
      );
      expect(NoticeEndDateFormFields.labelHidden).toEqual(GenericConstants.FALSE);
      expect(NoticeEndDateFormFields.labelSize).toEqual(GenericConstants.LABEL_SIZE_LARGE);
      expect(NoticeEndDateFormFields.hint.prototype).toEqual(
        GenericConstants.TRANSLATION_FUNCTION_LABEL_HINT.prototype
      );
      expect(NoticeEndDateFormFields.values).toEqual(DateValues);
      expect(NoticeEndDateFormFields.validator.prototype).toEqual(
        NoticeEndDateFormFieldsTestConstants.VALIDATOR_FUNCTION.prototype
      );
    });
  });

  describe('StartDateFormFields', () => {
    it('check StartDateFormFields constant', () => {
      expect(StartDateFormFields.classes).toBe(GenericConstants.CLASS_GOV_UK_DATE_INPUT);
      expect(StartDateFormFields.type).toBe(GenericConstants.TYPE_DATE);
      expect(StartDateFormFields.label.prototype).toEqual(GenericConstants.TRANSLATION_FUNCTION_LABEL_LEGEND.prototype);
      expect(StartDateFormFields.labelHidden).toEqual(GenericConstants.FALSE);
      expect(StartDateFormFields.labelSize).toEqual(GenericConstants.LABEL_SIZE_LARGE);
      expect(StartDateFormFields.hint.prototype).toEqual(GenericConstants.TRANSLATION_FUNCTION_LABEL_HINT.prototype);
      expect(StartDateFormFields.values).toEqual(DateValues);
      expect(StartDateFormFields.validator.prototype).toEqual(
        StartDateFormFieldsTestConstants.VALIDATOR_FUNCTION.prototype
      );
    });
  });
});
