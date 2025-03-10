import { GenericTseApplicationType } from '../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { LinkStatus } from '../../../main/definitions/links';
import { getApplicationState } from '../../../main/helpers/ApplicationStateHelper';
import { mockUserDetails } from '../mocks/mockUser';

describe('Applications State Helper', () => {
  describe('getApplicationState', () => {
    it('should return NOT_VIEWED when respondentState is empty', () => {
      const app: GenericTseApplicationType = { respondentState: [] };
      expect(getApplicationState(app, mockUserDetails)).toBe(LinkStatus.NOT_VIEWED);
    });

    it('should return NOT_VIEWED when respondentState is undefined', () => {
      const app: GenericTseApplicationType = {};
      expect(getApplicationState(app, mockUserDetails)).toBe(LinkStatus.NOT_VIEWED);
    });

    it('should return the correct application state when userId matches', () => {
      const app: GenericTseApplicationType = {
        respondentState: [
          {
            id: 'test1',
            value: {
              userIdamId: '1234',
              applicationState: LinkStatus.VIEWED,
            },
          },
        ],
      };
      expect(getApplicationState(app, mockUserDetails)).toBe(LinkStatus.VIEWED);
    });

    it('should return NOT_VIEWED when no matching userId is found', () => {
      const app: GenericTseApplicationType = {
        respondentState: [
          {
            id: 'test1',
            value: {
              userIdamId: '4567',
              applicationState: LinkStatus.VIEWED,
            },
          },
        ],
      };
      expect(getApplicationState(app, mockUserDetails)).toBe(LinkStatus.NOT_VIEWED);
    });

    it('should return the correct application state when multiple respondents exist', () => {
      const app: GenericTseApplicationType = {
        respondentState: [
          {
            id: 'test1',
            value: {
              userIdamId: '4567',
              applicationState: LinkStatus.VIEWED,
            },
          },
          {
            id: 'test1',
            value: {
              userIdamId: '1234',
              applicationState: LinkStatus.COMPLETED,
            },
          },
        ],
      };
      expect(getApplicationState(app, mockUserDetails)).toBe(LinkStatus.COMPLETED);
    });
  });
});
