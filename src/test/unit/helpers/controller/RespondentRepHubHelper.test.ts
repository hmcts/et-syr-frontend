import { RespondentET3Model } from '../../../../main/definitions/case';
import { ET3CaseDetailsLinksStatuses } from '../../../../main/definitions/links';
import { AnyRecord } from '../../../../main/definitions/util-types';
import { getRespondentName, getSectionsForRep } from '../../../../main/helpers/controller/RespondentRepHubHelper';
import caseDetailsStatusJson from '../../../../main/resources/locales/en/translation/case-details-status.json';
import caseDetailsJson from '../../../../main/resources/locales/en/translation/case-details.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';
import { mockRespondentET3Model } from '../../mocks/mockRespondentET3Model';
import mockUserCase from '../../mocks/mockUserCase';

describe('Respondent Rep Hub Controller Helper', () => {
  describe('getSections', () => {
    const translations: AnyRecord = {
      ...caseDetailsJson,
      ...caseDetailsStatusJson,
    };

    it('return sections with links and status', async () => {
      const req = mockRequestWithTranslation({ session: { userCase: mockUserCase } }, translations);
      const statuses = new ET3CaseDetailsLinksStatuses();

      const actual = getSectionsForRep(statuses, mockRespondentET3Model, req);
      expect(actual).toHaveLength(8);

      expect(actual[0].items).toHaveLength(1);
      const item1 = actual[0].items[0];
      expect(item1.title.text).toBe('View and edit your personal details');
      expect(item1.status.tag.text).toBe('Not available yet');
      expect(item1.status.tag.classes).toBe('govuk-tag--grey');
    });
  });

  describe('getRespondentName', () => {
    it('uses respondent name when the respondent has a name', async () => {
      const mockRespondent: RespondentET3Model = {
        respondentName: 'Jane Doe',
        respondentOrganisation: 'Acme Ltd',
      };
      const actual = getRespondentName(mockRespondent);
      expect(actual).toBe('Jane Doe');
    });

    it('uses the organisation name when the respondent name is blank', async () => {
      const mockRespondent: RespondentET3Model = {
        respondentName: '',
        respondentOrganisation: 'Acme Ltd',
      };
      const actual = getRespondentName(mockRespondent);
      expect(actual).toBe('Acme Ltd');
    });

    it('uses the respondent first and last name when name and organisation are blank', async () => {
      const mockRespondent: RespondentET3Model = {
        respondentFirstName: 'John',
        respondentLastName: 'Doe',
      };
      const actual = getRespondentName(mockRespondent);
      expect(actual).toBe('John Doe');
    });
  });
});
