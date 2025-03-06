import { GenericTseApplicationType } from '../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { LinkStatus } from '../../../main/definitions/links';
import { changeApplicationState, getApplicationState } from '../../../main/helpers/ApplicationStateHelper';
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
        respondentState: [{ userIdamId: '1234', applicationState: LinkStatus.VIEWED }],
      };
      expect(getApplicationState(app, mockUserDetails)).toBe(LinkStatus.VIEWED);
    });

    it('should return NOT_VIEWED when no matching userId is found', () => {
      const app: GenericTseApplicationType = {
        respondentState: [{ userIdamId: '4567', applicationState: LinkStatus.VIEWED }],
      };
      expect(getApplicationState(app, mockUserDetails)).toBe(LinkStatus.NOT_VIEWED);
    });

    it('should return the correct application state when multiple respondents exist', () => {
      const app: GenericTseApplicationType = {
        respondentState: [
          { userIdamId: '4567', applicationState: LinkStatus.VIEWED },
          { userIdamId: '1234', applicationState: LinkStatus.COMPLETED },
        ],
      };
      expect(getApplicationState(app, mockUserDetails)).toBe(LinkStatus.COMPLETED);
    });
  });

  describe('changeApplicationState', () => {
    it('should add a new state when respondentState is empty', () => {
      const app: GenericTseApplicationType = { respondentState: [] };
      changeApplicationState(app, mockUserDetails, LinkStatus.VIEWED);
      expect(app.respondentState).toEqual([{ userIdamId: '1234', applicationState: LinkStatus.VIEWED }]);
    });

    it('should add a new state when respondentState is undefined', () => {
      const app: GenericTseApplicationType = {};
      changeApplicationState(app, mockUserDetails, LinkStatus.VIEWED);
      expect(app.respondentState).toEqual([{ userIdamId: '1234', applicationState: LinkStatus.VIEWED }]);
    });

    it('should update the state if userId already exists', () => {
      const app: GenericTseApplicationType = {
        respondentState: [{ userIdamId: '1234', applicationState: LinkStatus.NOT_VIEWED }],
      };
      changeApplicationState(app, mockUserDetails, LinkStatus.VIEWED);
      expect(app.respondentState).toEqual([{ userIdamId: '1234', applicationState: LinkStatus.VIEWED }]);
    });

    it('should not modify other users when updating state', () => {
      const app: GenericTseApplicationType = {
        respondentState: [
          { userIdamId: '4567', applicationState: LinkStatus.VIEWED },
          { userIdamId: '1234', applicationState: LinkStatus.NOT_VIEWED },
        ],
      };
      changeApplicationState(app, mockUserDetails, LinkStatus.COMPLETED);
      expect(app.respondentState).toEqual([
        { userIdamId: '4567', applicationState: LinkStatus.VIEWED },
        { userIdamId: '1234', applicationState: LinkStatus.COMPLETED },
      ]);
    });

    it('should add a new user if not present', () => {
      const app: GenericTseApplicationType = {
        respondentState: [{ userIdamId: '4567', applicationState: LinkStatus.VIEWED }],
      };
      changeApplicationState(app, mockUserDetails, LinkStatus.NOT_VIEWED);
      expect(app.respondentState).toEqual([
        { userIdamId: '4567', applicationState: LinkStatus.VIEWED },
        { userIdamId: '1234', applicationState: LinkStatus.NOT_VIEWED },
      ]);
    });
  });
});
