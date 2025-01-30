import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { clearTempFields } from '../../../../main/helpers/controller/RespondToTribunalSubmitHelper';

describe('Respond to Tribunal Controller Helper', () => {
  describe('clearTempFields', () => {
    it('should clear all temporary fields from userCase', () => {
      const userCase = {
        id: 'case123',
        responseText: 'test',
        hasSupportingMaterial: YesOrNo.YES,
        supportingMaterialFile: {
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

      expect(userCase.responseText).toBeUndefined();
      expect(userCase.hasSupportingMaterial).toBeUndefined();
      expect(userCase.supportingMaterialFile).toBeUndefined();
      expect(userCase.copyToOtherPartyYesOrNo).toBeUndefined();
      expect(userCase.copyToOtherPartyText).toBeUndefined();
    });
  });
});
