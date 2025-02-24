import { CaseWithId } from '../../definitions/case';

/**
 * Clear temporary fields stored in session
 * @param userCase session userCase
 */
export const clearTempFields = (userCase: CaseWithId): void => {
  userCase.selectedGenericTseApplication = undefined;
  userCase.responseText = undefined;
  userCase.hasSupportingMaterial = undefined;
  userCase.supportingMaterialFile = undefined;
  userCase.copyToOtherPartyYesOrNo = undefined;
  userCase.copyToOtherPartyText = undefined;
};
