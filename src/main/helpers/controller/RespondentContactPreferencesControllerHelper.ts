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
        PageUrls.RESPONDENT_ADDRESS + InterceptPaths.RESPONDENT_CONTACT_PREFERENCES,
        translations.change,
        translations.postalAddress
      )
    ),
    addSummaryRow(
      translations.dxAddress,
      userCase.et3ResponseDXAddress ?? '-',
      createChangeAction(
        PageUrls.RESPONDENT_DX_ADDRESS + InterceptPaths.RESPONDENT_CONTACT_PREFERENCES,
        translations.change,
        translations.dxAddress
      )
    ),
    addSummaryRow(
      translations.contactPhoneNumber,
      userCase.responseRespondentPhone1 ?? '-',
      createChangeAction(
        PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER + InterceptPaths.RESPONDENT_CONTACT_PREFERENCES,
        translations.change,
        translations.contactPhoneNumber
      )
    ),
    addSummaryRow(translations.emailAddress, email)
  );

  return rows;
};
