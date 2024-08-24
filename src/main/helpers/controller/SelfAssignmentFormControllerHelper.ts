import { CaseApiDataResponse } from '../../definitions/api/caseApiResponse';
import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId } from '../../definitions/case';
import { DefaultValues } from '../../definitions/constants';

export default class SelfAssignmentFormControllerHelper {
  /**
   * Generates case with id for empty req.session.userCase value.
   * We use this data to send it to the form the reassign entered values back in the form fields.
   * For createdDate, lastModified and state values we use default values as empty string and undefined
   * @param formData  gets the following fields from formData which is partially CaseWithId.
   *                  id Case id, usually referred as case submission reference entered to the form by respondent.
   *                  id value can be only 16 digit decimal or 16 digit divided by dash like 1234-5678-1234-5678.
   *                  If it is divided by dash, this method automatically removes dash values with empty string.
   *                  respondentName Name of the respondent entered to the form by respondent.
   *                  firstName First Name of the claimant entered to the form by respondent.
   *                  lastName Last name of the claimant entered to the form by respondent.
   */
  public static generateBasicUserCaseBySelfAssignmentFormData = (formData: Partial<CaseWithId>): CaseWithId => {
    return <CaseWithId>{
      createdDate: DefaultValues.STRING_EMPTY,
      lastModified: DefaultValues.STRING_EMPTY,
      state: undefined,
      id: formData.id,
      respondentName: formData.respondentName,
      firstName: formData.firstName,
      lastName: formData.lastName,
    };
  };

  /**
   * Sets respondent name to the req.session.userCase object. Because when data returns from case service api
   * it doesn't have respondent name value as in the CaseWithId data model.
   * @param req request object to set session's userCase respondent name value.
   * @param caseData CaseApiData response that has respondent name.
   */
  public static setRespondentName = (req: AppRequest, caseData: CaseApiDataResponse): void => {
    if (req.session.userCase) {
      if (caseData?.case_data?.respondentCollection) {
        caseData?.case_data?.respondentCollection.forEach(respondent => {
          if (respondent?.value?.respondent_name) {
            req.session.userCase.respondentName = respondent.value.respondent_name;
          }
        });
      }
    }
  };
}
