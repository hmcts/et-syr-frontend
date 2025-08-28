import {
  RespondentSolicitorType,
  getRespondentSolicitorTypeByIndex,
  getRespondentSolicitorTypeFromLabel,
  isValidRespondentSolicitorLabel,
} from '../../../../main/definitions/enums/respondentSolicitorType';

describe('RespondentSolicitorType Enum Utilities', () => {
  describe('getRespondentSolicitorTypeFromLabel', () => {
    it('should return the correct enums value for a valid label', () => {
      expect(getRespondentSolicitorTypeFromLabel('[SOLICITORA]')).toBe(RespondentSolicitorType.SOLICITORA);
      expect(getRespondentSolicitorTypeFromLabel('[SOLICITORF]')).toBe(RespondentSolicitorType.SOLICITORF);
    });

    it('should throw an error for an invalid label', () => {
      expect(() => getRespondentSolicitorTypeFromLabel('[INVALID]')).toThrow(
        'No RespondentSolicitorType found for label: [INVALID]'
      );
    });
  });

  describe('isValidRespondentSolicitorLabel', () => {
    it('should return true for valid labels', () => {
      expect(isValidRespondentSolicitorLabel('[SOLICITORA]')).toBe(true);
      expect(isValidRespondentSolicitorLabel('[SOLICITORH]')).toBe(true);
    });

    it('should return false for invalid labels', () => {
      expect(isValidRespondentSolicitorLabel('[NOT_EXISTING]')).toBe(false);
      expect(isValidRespondentSolicitorLabel('')).toBe(false);
    });
  });

  describe('getRespondentSolicitorTypeByIndex', () => {
    it('should return the correct enums value for a valid index', () => {
      const allValues = Object.values(RespondentSolicitorType);
      allValues.forEach((val, index) => {
        expect(getRespondentSolicitorTypeByIndex(index)).toBe(val);
      });
    });

    it('should throw an error for an out-of-bounds index', () => {
      const len = Object.values(RespondentSolicitorType).length;
      expect(() => getRespondentSolicitorTypeByIndex(-1)).toThrow();
      expect(() => getRespondentSolicitorTypeByIndex(len)).toThrow();
    });
  });
});
