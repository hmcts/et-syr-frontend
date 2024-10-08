import { CaseWithId } from '../../../../main/definitions/case';
import { InterceptPaths, PageUrls } from '../../../../main/definitions/constants';
import { SummaryListRow, addSummaryRow, createChangeAction } from '../../../../main/definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../../../main/definitions/util-types';
import { getContactPreferencesDetails } from '../../../../main/helpers/controller/RespondentContactPreferencesControllerHelper';

describe('getContactPreferencesDetails', () => {
  const translationsMock: AnyRecord = {
    postalAddress: 'Postal Address',
    change: 'Change',
    dxAddress: 'DX Address',
    contactPhoneNumber: 'Contact Phone Number',
    emailAddress: 'Email Address',
  };

  it('should return correct summary list rows when all fields are provided', () => {
    const userCase: CaseWithId = {
      createdDate: '',
      lastModified: '',
      state: undefined,
      id: '1',
      address1: '123 Test St',
      addressPostcode: 'AB12 3CD',
    };

    const expectedRows: SummaryListRow[] = [
      addSummaryRow(
        translationsMock.postalAddress,
        '123 Test St, AB12 3CD',
        createChangeAction(
          PageUrls.RESPONDENT_SELECT_POST_CODE + InterceptPaths.ANSWERS_CHANGE,
          translationsMock.change,
          translationsMock.postalAddress
        )
      ),
      addSummaryRow(
        translationsMock.dxAddress,
        '',
        createChangeAction(
          PageUrls.RESPONDENT_DX_ADDRESS + InterceptPaths.ANSWERS_CHANGE,
          translationsMock.change,
          translationsMock.dxAddress
        )
      ),
      addSummaryRow(
        translationsMock.contactPhoneNumber,
        '',
        createChangeAction(
          PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER + InterceptPaths.ANSWERS_CHANGE,
          translationsMock.change,
          translationsMock.contactPhoneNumber
        )
      ),
      addSummaryRow(translationsMock.emailAddress, ''),
    ];

    const result = getContactPreferencesDetails(userCase, translationsMock);

    expect(result).toEqual(expectedRows);
  });
});
