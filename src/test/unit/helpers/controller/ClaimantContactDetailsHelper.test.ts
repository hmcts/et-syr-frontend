import { AdditionalClaimant, CaseWithId, EmailOrPost, YesOrNo } from '../../../../main/definitions/case';
import { AnyRecord } from '../../../../main/definitions/util-types';
import {
  getAdditionalClaimantRows,
  getAdditionalClaimantsSummaryLists,
  getClaimantContactDetails
} from '../../../../main/helpers/controller/ClaimantContactDetailsHelper';
import claimantContactDetailsJson
  from '../../../../main/resources/locales/en/translation/claimant-contact-details.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Claimant Contact Details Helper', () => {
  describe('getClaimantContactDetails', () => {
    const translations: AnyRecord = {
      ...claimantContactDetailsJson,
    };

    it('should return claimant details when claimant is not represented', () => {
      const userCase: CaseWithId = {
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Street',
        address2: 'Apt 1',
        addressTown: 'London',
        addressPostcode: 'W1A 1AA',
        addressCountry: 'UK',
        email: 'john@example.com',
        claimantContactPreference: EmailOrPost.EMAIL,
      } as CaseWithId;

      const req = mockRequestWithTranslation({ session: { userCase } }, translations);

      const result = getClaimantContactDetails(req);
      expect(result).toHaveLength(4);
      expect(result[0].key.text).toBe('Name');
      expect(result[0].value.text).toBe('John Doe');
      expect(result[1].key.text).toBe('Address');
      expect(result[1].value.text).toBe('123 Street, Apt 1, London, W1A 1AA, UK');
      expect(result[2].key.text).toBe('Email');
      expect(result[2].value.text).toBe('john@example.com');
      expect(result[3].key.text).toBe('Preferred method of contact');
      expect(result[3].value.text).toBe('Email');
    });

    it('should return claimant details when claimant info is undefined', () => {
      const userCase: CaseWithId = {
        firstName: 'John',
        lastName: 'Doe',
      } as CaseWithId;

      const req = mockRequestWithTranslation({ session: { userCase } }, translations);

      const result = getClaimantContactDetails(req);
      expect(result).toHaveLength(3);
      expect(result[0].key.text).toBe('Name');
      expect(result[0].value.text).toBe('John Doe');
      expect(result[1].key.text).toBe('Address');
      expect(result[1].value.text).toBe('Not provided');
      expect(result[2].key.text).toBe('Email');
      expect(result[2].value.text).toBe('Not provided');
    });

    it('should return legal rep details when claimant is represented', () => {
      const userCase: CaseWithId = {
        claimantRepresentedQuestion: YesOrNo.YES,
        representativeClaimantType: {
          name_of_representative: 'Jane Lawyer',
          name_of_organisation: 'Law Co',
          representative_email_address: 'jane@lawco.com',
          representative_address: {
            AddressLine1: '456 Court Rd',
            AddressLine2: '',
            AddressLine3: '',
            PostTown: 'Manchester',
            County: 'Greater Manchester',
            PostCode: 'M1 2AB',
            Country: 'UK',
          },
          representative_preference: 'Post',
        },
      } as CaseWithId;

      const req = mockRequestWithTranslation({ session: { userCase } }, translations);

      const result = getClaimantContactDetails(req);
      expect(result).toHaveLength(5);
      expect(result[0].key.text).toBe('Legal representative’s name');
      expect(result[0].value.text).toBe('Jane Lawyer');
      expect(result[1].key.text).toBe('Legal rep’s organisation');
      expect(result[1].value.text).toBe('Law Co');
      expect(result[2].key.text).toBe('Address');
      expect(result[2].value.text).toBe('456 Court Rd, Manchester, Greater Manchester, M1 2AB, UK');
      expect(result[3].key.text).toBe('Email');
      expect(result[3].value.text).toBe('jane@lawco.com');
      expect(result[4].key.text).toBe('Preferred method of contact');
      expect(result[4].value.text).toBe('Post');
    });

    it('should return legal rep details when legal rep info is undefined', () => {
      const userCase: CaseWithId = {
        claimantRepresentedQuestion: YesOrNo.YES,
        representativeClaimantType: {},
      } as CaseWithId;

      const req = mockRequestWithTranslation({ session: { userCase } }, translations);

      const result = getClaimantContactDetails(req);
      expect(result).toHaveLength(4);
      expect(result[0].key.text).toBe('Legal representative’s name');
      expect(result[0].value.text).toBe('Not provided');
      expect(result[1].key.text).toBe('Legal rep’s organisation');
      expect(result[1].value.text).toBe('Not provided');
      expect(result[2].key.text).toBe('Address');
      expect(result[2].value.text).toBe('Not provided');
      expect(result[3].key.text).toBe('Email');
      expect(result[3].value.text).toBe('Not provided');
    });
    it('should skip legal rep preference when preference is not EmailOrPost', () => {
      const userCase: CaseWithId = {
        claimantRepresentedQuestion: YesOrNo.YES,
        representativeClaimantType: {
          representative_preference: 'DX Number',
        },
      } as CaseWithId;

      const req = mockRequestWithTranslation({ session: { userCase } }, translations);

      const result = getClaimantContactDetails(req);
      expect(result).toHaveLength(4);
      expect(result[0].key.text).toBe(translations.legalRepresentativesName);
      expect(result[1].key.text).toBe(translations.legalRepsOrganisation);
      expect(result[2].key.text).toBe(translations.address);
      expect(result[3].key.text).toBe(translations.email);
    });
  });

  describe('getAdditionalClaimantRows', () => {
    const translations: AnyRecord = { ...claimantContactDetailsJson };

    it('should return name, address and email rows', () => {
      const claimant: AdditionalClaimant = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        address: {
          AddressLine1: '10 High St',
          PostTown: 'London',
          PostCode: 'E1 1AA',
          Country: 'UK',
        },
      };
      const result = getAdditionalClaimantRows(claimant, translations);
      expect(result).toHaveLength(3);
      expect(result[0].key.text).toBe('Name');
      expect(result[0].value.text).toBe('Jane Smith');
      expect(result[1].key.text).toBe('Address');
      expect(result[1].value.text).toBe('10 High St, London, E1 1AA, UK');
      expect(result[2].key.text).toBe('Email');
      expect(result[2].value.text).toBe('jane@example.com');
    });

    it('should include title in name when provided', () => {
      const claimant: AdditionalClaimant = { title: 'Ms', firstName: 'Jane', lastName: 'Smith' };
      const result = getAdditionalClaimantRows(claimant, translations);
      expect(result[0].value.text).toBe('Ms Jane Smith');
    });

    it('should fall back to notProvided when fields are missing', () => {
      const claimant: AdditionalClaimant = {};
      const result = getAdditionalClaimantRows(claimant, translations);
      expect(result[0].value.text).toBe('Not provided');
      expect(result[1].value.text).toBe('Not provided');
      expect(result[2].value.text).toBe('Not provided');
    });

    it('should not include date of birth', () => {
      const claimant: AdditionalClaimant = {
        firstName: 'Jane',
        dob: { year: '1990', month: '01', day: '01' },
      };
      const result = getAdditionalClaimantRows(claimant, translations);
      expect(result).toHaveLength(3);
      result.forEach(row => {
        expect(row.key.text).not.toMatch(/birth/i);
      });
    });
  });

  describe('getAdditionalClaimantsSummaryLists', () => {
    it('should return empty array when no additional claimants', () => {
      const req = mockRequestWithTranslation({ session: { userCase: {} } }, { ...claimantContactDetailsJson });
      expect(getAdditionalClaimantsSummaryLists(req, undefined)).toEqual([]);
    });

    it('should label claimants starting from 2', () => {
      const req = mockRequestWithTranslation(
        {
          session: {
            userCase: {
              additionalClaimants: [
                { firstName: 'A', lastName: 'One' },
                { firstName: 'B', lastName: 'Two' },
              ],
            },
          },
        },
        { ...claimantContactDetailsJson }
      );
      const result = getAdditionalClaimantsSummaryLists(req, undefined);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Claimant 2');
      expect(result[1].name).toBe('Claimant 3');
    });

    it('should return all additional claimants without a cap', () => {
      const claimants: AdditionalClaimant[] = Array.from({ length: 10 }, (_, i) => ({ firstName: `Claimant${i}` }));
      const req = mockRequestWithTranslation(
        { session: { userCase: { additionalClaimants: claimants } } },
        { ...claimantContactDetailsJson }
      );
      expect(getAdditionalClaimantsSummaryLists(req, undefined)).toHaveLength(10);
    });

    it('should use provided claimants array instead of session when supplied', () => {
      const sessionClaimants: AdditionalClaimant[] = [{ firstName: 'Session', lastName: 'Claimant' }];
      const overrideClaimants: AdditionalClaimant[] = [
        { firstName: 'Override', lastName: 'One' },
        { firstName: 'Override', lastName: 'Two' },
      ];
      const req = mockRequestWithTranslation(
        { session: { userCase: { additionalClaimants: sessionClaimants } } },
        { ...claimantContactDetailsJson }
      );
      const result = getAdditionalClaimantsSummaryLists(req, overrideClaimants);
      expect(result).toHaveLength(2);
      expect(result[0].rows[0].value.text).toBe('Override One');
    });

    it('should return empty array when provided claimants array is empty, even with session claimants present', () => {
      const sessionClaimants: AdditionalClaimant[] = [{ firstName: 'Session', lastName: 'Claimant' }];
      const req = mockRequestWithTranslation(
        { session: { userCase: { additionalClaimants: sessionClaimants } } },
        { ...claimantContactDetailsJson }
      );
      expect(getAdditionalClaimantsSummaryLists(req, [])).toEqual([]);
    });
  });
});
