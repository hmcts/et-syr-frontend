import { CaseWithId, RespondentET3Model, YesOrNo } from '../definitions/case';
import { Et1Address } from '../definitions/complexTypes/et1Address';

import ObjectUtils from './ObjectUtils';
import StringUtils from './StringUtils';

export default class AddressUtils {
  /**
   * Finds respondent address which is entered by the claimant. This method is used when user case
   * et3IsRespondentAddressCorrect is Yes.
   * @param selectedRespondent respondent, who responses the ET3 Form.
   * @return address which is entered by the claimant.
   */
  public static findExistingRespondentAddress(selectedRespondent: RespondentET3Model): Et1Address {
    if (ObjectUtils.isEmpty(selectedRespondent)) {
      return undefined;
    }
    let respondentAddress = selectedRespondent.respondentAddress;
    if (
      ObjectUtils.isEmpty(respondentAddress) &&
      StringUtils.isNotBlank(selectedRespondent.respondentAddressLine1) &&
      StringUtils.isNotBlank(selectedRespondent.respondentAddressCountry) &&
      StringUtils.isNotBlank(selectedRespondent.respondentAddressPostTown)
    ) {
      respondentAddress = {
        AddressLine1: selectedRespondent.respondentAddressLine1,
        AddressLine2: selectedRespondent.respondentAddressLine2,
        AddressLine3: selectedRespondent.respondentAddressLine3,
        Country: selectedRespondent.respondentAddressCountry,
        County: selectedRespondent.respondentAddressCounty,
        PostCode: selectedRespondent.respondentAddressPostCode,
        PostTown: selectedRespondent.respondentAddressPostTown,
      };
    }
    return respondentAddress;
  }

  /**
   * Finds respondent address which is entered by the claimant. This method is used when user case
   * et3IsRespondentAddressCorrect is No.
   * @param userCase case which et3 form is being responded.
   * @param selectedRespondent respondent, who responses the ET3 Form.
   * @return address which is entered by the respondent.
   */
  public static findResponseRespondentAddress(
    userCase: CaseWithId,
    selectedRespondent: RespondentET3Model
  ): Et1Address {
    if (ObjectUtils.isEmpty(userCase) && ObjectUtils.isEmpty(selectedRespondent)) {
      return undefined;
    }
    let respondentAddress: Et1Address = userCase.responseRespondentAddress;
    if (
      ObjectUtils.isEmpty(respondentAddress) &&
      StringUtils.isNotBlank(userCase.responseRespondentAddressLine1) &&
      StringUtils.isNotBlank(userCase.responseRespondentAddressCountry) &&
      StringUtils.isNotBlank(userCase.responseRespondentAddressPostTown)
    ) {
      respondentAddress = {
        AddressLine1: userCase.responseRespondentAddressLine1,
        AddressLine2: userCase.responseRespondentAddressLine2,
        AddressLine3: userCase.responseRespondentAddressLine3,
        Country: userCase.responseRespondentAddressCountry,
        County: userCase.responseRespondentAddressCounty,
        PostCode: userCase.responseRespondentAddressPostCode,
        PostTown: userCase.responseRespondentAddressPostTown,
      };
    }
    if (ObjectUtils.isEmpty(respondentAddress)) {
      respondentAddress = selectedRespondent.responseRespondentAddress;
      if (
        ObjectUtils.isEmpty(respondentAddress) &&
        StringUtils.isNotBlank(selectedRespondent.responseRespondentAddressLine1) &&
        StringUtils.isNotBlank(selectedRespondent.responseRespondentAddressCountry) &&
        StringUtils.isNotBlank(selectedRespondent.responseRespondentAddressPostTown)
      ) {
        respondentAddress = {
          AddressLine1: selectedRespondent.responseRespondentAddressLine1,
          AddressLine2: selectedRespondent.responseRespondentAddressLine2,
          AddressLine3: selectedRespondent.responseRespondentAddressLine3,
          Country: selectedRespondent.responseRespondentAddressCountry,
          County: selectedRespondent.responseRespondentAddressCounty,
          PostCode: selectedRespondent.responseRespondentAddressPostCode,
          PostTown: selectedRespondent.responseRespondentAddressPostTown,
        };
      }
    }
    return respondentAddress;
  }

  /**
   * Finds response respondent address by et3IsRespondentAddressCorrect field of user case. If respondent address is
   * correct returns respondent address entered by the claimant else returns respondent address entered by the
   * respondent. If et3IsRespondentAddressCorrect field is NO returns new entered value by the respondent,
   * else returns existing value.
   * @param userCase is the case that respondent replies to.
   * @param selectedRespondent is the respondent of the et3 form.
   * @return existing or respondent's new entered address according to the field et3IsRespondentAddressCorrect.
   */
  public static findResponseRespondentAddressByEt3IsRespondentAddressCorrectField(
    userCase: CaseWithId,
    selectedRespondent: RespondentET3Model
  ): Et1Address {
    let responseRespondentAddress: Et1Address;
    if (YesOrNo.NO === userCase.et3IsRespondentAddressCorrect) {
      responseRespondentAddress = AddressUtils.findResponseRespondentAddress(userCase, selectedRespondent);
    } else {
      responseRespondentAddress = AddressUtils.findExistingRespondentAddress(selectedRespondent);
    }
    return responseRespondentAddress;
  }

  /**
   * Sets address to response respondent address fields of both user case and selected respondent
   * @param userCase request session case which will have the response respondent address.
   * @param selectedRespondent is the respondent who is replying the claim.
   * @param responseRespondentAddress address entered by the respondent or already entered by the claimant according to
   *                                  the et3IsRespondentAddressCorrect value.
   */
  public static setResponseRespondentAddress(
    userCase: CaseWithId,
    selectedRespondent: RespondentET3Model,
    responseRespondentAddress: Et1Address
  ): void {
    userCase.responseRespondentAddress = responseRespondentAddress;
    userCase.responseRespondentAddressLine1 = responseRespondentAddress?.AddressLine1;
    userCase.responseRespondentAddressLine2 = responseRespondentAddress?.AddressLine2;
    userCase.responseRespondentAddressLine3 = responseRespondentAddress?.AddressLine3;
    userCase.responseRespondentAddressCountry = responseRespondentAddress?.Country;
    userCase.responseRespondentAddressCounty = responseRespondentAddress?.County;
    userCase.responseRespondentAddressPostTown = responseRespondentAddress?.PostTown;
    userCase.responseRespondentAddressPostCode = responseRespondentAddress?.PostCode;
    selectedRespondent.responseRespondentAddress = responseRespondentAddress;
    selectedRespondent.responseRespondentAddressLine1 = responseRespondentAddress?.AddressLine1;
    selectedRespondent.responseRespondentAddressLine2 = responseRespondentAddress?.AddressLine2;
    selectedRespondent.responseRespondentAddressLine3 = responseRespondentAddress?.AddressLine3;
    selectedRespondent.responseRespondentAddressCountry = responseRespondentAddress?.Country;
    selectedRespondent.responseRespondentAddressCounty = responseRespondentAddress?.County;
    selectedRespondent.responseRespondentAddressPostTown = responseRespondentAddress?.PostTown;
    selectedRespondent.responseRespondentAddressPostCode = responseRespondentAddress?.PostCode;
  }
}
