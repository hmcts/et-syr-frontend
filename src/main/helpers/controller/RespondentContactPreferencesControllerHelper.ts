import { CaseWithId } from '../../definitions/case';
import { InterceptPaths, PageUrls } from '../../definitions/constants';
import { SummaryListRow, addSummaryRow, createChangeAction } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import { answersAddressFormatter } from '../AddressHelper';

export const getContactPreferencesDetails = (
  userCase: CaseWithId,
  email: string,
  translations: AnyRecord
): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];

  rows.push(
    addSummaryRow(
      translations.postalAddress,
      answersAddressFormatter(
        userCase.responseRespondentAddressLine1,
        userCase.responseRespondentAddressLine2,
        userCase.responseRespondentAddressLine3,
        userCase.responseRespondentAddressPostTown,
        userCase.responseRespondentAddressCounty,
        userCase.responseRespondentAddressCountry,
        userCase.responseRespondentAddressPostCode
      ),
      createChangeAction(
        PageUrls.RESPONDENT_SELECT_POST_CODE + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.postalAddress
      )
    ),
    addSummaryRow(
      translations.dxAddress,
      userCase.et3ResponseDXAddress !== undefined ? userCase.et3ResponseDXAddress : translations.notProvided,
      createChangeAction(
        PageUrls.RESPONDENT_DX_ADDRESS + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.dxAddress
      )
    ),
    addSummaryRow(
      translations.contactPhoneNumber,
      userCase.responseRespondentPhone1 !== undefined ? userCase.responseRespondentPhone1 : translations.notProvided,
      createChangeAction(
        PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.contactPhoneNumber
      )
    ),
    addSummaryRow(translations.emailAddress, email)
  );

  return rows;
};
