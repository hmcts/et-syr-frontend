import { CaseWithId } from '../../definitions/case';
import { InterceptPaths, PageUrls } from '../../definitions/constants';
import { SummaryListRow, addSummaryRow, createChangeAction } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

export const getContactPreferencesDetails = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];

  rows.push(
    addSummaryRow(
      translations.postalAddress,
      userCase.address1 === undefined ? '' : userCase.address1 + ', ' + userCase.addressPostcode,
      createChangeAction(
        PageUrls.RESPONDENT_SELECT_POST_CODE + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.postalAddress
      )
    ),
    addSummaryRow(
      translations.dxAddress,
      '',
      createChangeAction(
        PageUrls.RESPONDENT_DX_ADDRESS + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.dxAddress
      )
    ),
    addSummaryRow(
      translations.contactPhoneNumber,
      '',
      createChangeAction(
        PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.contactPhoneNumber
      )
    ),
    addSummaryRow(translations.emailAddress, '')
  );

  return rows;
};
