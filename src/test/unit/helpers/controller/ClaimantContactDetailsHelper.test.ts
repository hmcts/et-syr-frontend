import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { AnyRecord } from '../../../../main/definitions/util-types';
import { getClaimantContactDetails } from '../../../../main/helpers/controller/ClaimantContactDetailsHelper';
import claimantContactDetailsJson from '../../../../main/resources/locales/en/translation/claimant-contact-details.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Claimant Contact Details Helper', () => {
  describe('getClaimantContactDetails', () => {
    const translations: AnyRecord = {
      ...claimantContactDetailsJson,
    };

    it('should return claimant details when user is not represented', () => {
      const userCase: CaseWithId = {
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Street',
        address2: 'Apt 1',
        addressTown: 'London',
        addressPostcode: 'W1A 1AA',
        addressCountry: 'UK',
        email: 'john@example.com',
        claimantRepresentedQuestion: 'No',
      } as CaseWithId;

      const req = mockRequestWithTranslation({ session: { userCase } }, translations);

      const result = getClaimantContactDetails(req);
      expect(result).toHaveLength(3);
      expect(result[0].key.text).toBe('Name');
      expect(result[0].value.text).toBe('John Doe');
      expect(result[1].key.text).toBe('Address');
      expect(result[1].value.text).toBe('123 Street, Apt 1, London, W1A 1AA, UK');
      expect(result[2].key.text).toBe('Email');
      expect(result[2].value.text).toBe('john@example.com');
    });

    it('should return legal rep details when user is represented with MyHMCTS', () => {
      const userCase: CaseWithId = {
        caseSource: 'MyHMCTS',
        claimantRepresentedQuestion: YesOrNo.YES,
        representativeClaimantType: {
          name_of_representative: 'Jane Lawyer',
          name_of_organisation: 'Law Co',
          representative_email_address: 'jane@lawco.com',
          myHmctsOrganisation: {
            organisationID: 'orgId',
            organisationName: 'orgName',
          },
          representative_address: {
            AddressLine1: '456 Court Rd',
            AddressLine2: '',
            AddressLine3: '',
            PostTown: 'Manchester',
            County: 'Greater Manchester',
            PostCode: 'M1 2AB',
            Country: 'UK',
          },
        },
      } as CaseWithId;

      const req = mockRequestWithTranslation({ session: { userCase } }, translations);

      const result = getClaimantContactDetails(req);
      expect(result).toHaveLength(4);
      expect(result[0].key.text).toBe('Legal representative’s name');
      expect(result[0].value.text).toBe('Jane Lawyer');
      expect(result[1].key.text).toBe('Legal rep’s organisation');
      expect(result[1].value.text).toBe('Law Co');
      expect(result[2].key.text).toBe('Address');
      expect(result[2].value.text).toBe('456 Court Rd, Manchester, Greater Manchester, M1 2AB, UK');
      expect(result[3].key.text).toBe('Email');
      expect(result[3].value.text).toBe('jane@lawco.com');
    });
  });
});
