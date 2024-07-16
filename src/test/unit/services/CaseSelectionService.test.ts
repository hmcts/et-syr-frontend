import { CaseWithId } from '../../../main/definitions/case';
import { CaseSelectionServiceTestConstants } from '../../../main/definitions/constants';
import { getRedirectUrl } from '../../../main/services/CaseSelectionService';
import mockUserCase from '../mocks/mockUserCase';

describe('CaseSelectionServiceTest', () => {
  const caseWithId: CaseWithId = mockUserCase;
  describe('getRedirectUrl', () => {
    beforeEach(() => {
      caseWithId.id = CaseSelectionServiceTestConstants.TEST_CASE_ID;
    });
    it('should return response hub url with given user case id and language param', () => {
      expect(getRedirectUrl(caseWithId, CaseSelectionServiceTestConstants.TEST_LANGUAGE_PARAM)).toBe(
        CaseSelectionServiceTestConstants.GET_REDIRECT_URL_EXPECTED_VALUE
      );
    });
  });
});
