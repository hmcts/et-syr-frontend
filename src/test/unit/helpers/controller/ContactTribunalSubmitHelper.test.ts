import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { GenericTseApplicationTypeItem } from '../../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../../../../main/definitions/constants';
import { clearTempFields, getLatestApplication } from '../../../../main/helpers/controller/ContactTribunalSubmitHelper';
import { mockUserDetails } from '../../mocks/mockUser';

describe('Contact Tribunal Submit Controller Helper', () => {
  describe('clearTempFields', () => {
    it('should clear all temporary fields from userCase', () => {
      const userCase = {
        id: 'case123',
        contactApplicationType: 'witness',
        contactApplicationText: 'Change claim',
        contactApplicationFile: {
          document_url: '12345',
          document_filename: 'test.pdf',
          document_binary_url: '',
          document_size: 1000,
          document_mime_type: 'pdf',
        },
        copyToOtherPartyYesOrNo: YesOrNo.NO,
        copyToOtherPartyText: 'No reason',
      } as CaseWithId;

      clearTempFields(userCase);

      expect(userCase.contactApplicationType).toBeUndefined();
      expect(userCase.contactApplicationText).toBeUndefined();
      expect(userCase.contactApplicationFile).toBeUndefined();
      expect(userCase.copyToOtherPartyYesOrNo).toBeUndefined();
      expect(userCase.copyToOtherPartyText).toBeUndefined();
    });
  });

  describe('getLatestApplication', () => {
    it('should return the latest application owned by the user', () => {
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: '1',
          value: {
            applicant: Applicant.RESPONDENT,
            applicantIdamId: '1234',
          },
        },
        {
          id: '2',
          value: {
            applicant: Applicant.RESPONDENT,
            applicantIdamId: '1234',
          },
        },
      ];
      const result = getLatestApplication(apps, mockUserDetails);
      expect(result.id).toBe('2');
    });

    it('should return undefined if no applications match the user', () => {
      const apps: GenericTseApplicationTypeItem[] = [
        {
          id: '1',
          value: {
            applicant: Applicant.CLAIMANT,
          },
        },
      ];
      const result = getLatestApplication(apps, mockUserDetails);
      expect(result).toBeUndefined();
    });

    it('should return undefined if applications list is empty', () => {
      const result = getLatestApplication([], mockUserDetails);
      expect(result).toBeUndefined();
    });

    it('should return undefined if applications is undefined', () => {
      const result = getLatestApplication(undefined, mockUserDetails);
      expect(result).toBeUndefined();
    });
  });
});
