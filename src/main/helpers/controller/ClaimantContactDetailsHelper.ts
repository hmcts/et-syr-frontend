import { AppRequest } from '../../definitions/appRequest';
import { AdditionalClaimant, CaseWithId, EmailOrPost } from '../../definitions/case';
import { TranslationKeys, YES } from '../../definitions/constants';
import { SummaryListRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import { answersAddressFormatter } from '../AddressHelper';

/**
 * Get claimant contact details
 * @param req request
 */
export const getClaimantContactDetails = (req: AppRequest): SummaryListRow[] => {
  const userCase = req.session?.userCase;
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.CLAIMANT_CONTACT_DETAILS, { returnObjects: true }),
  };
  if (isClaimantRepresented(userCase)) {
    return getClaimantLegalRepInfo(userCase, translations);
  } else {
    return getClaimantInfo(userCase, translations);
  }
};

const isClaimantRepresented = (userCase: CaseWithId): boolean => {
  return YES === userCase.claimantRepresentedQuestion && userCase.representativeClaimantType !== undefined;
};

const getClaimantLegalRepInfo = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const details: SummaryListRow[] = [];
  const rep = userCase.representativeClaimantType;

  details.push(
    addSummaryRow(translations.legalRepresentativesName, rep.name_of_representative || translations.notProvided)
  );

  details.push(addSummaryRow(translations.legalRepsOrganisation, rep.name_of_organisation || translations.notProvided));

  const address = rep.representative_address;
  const addressString = answersAddressFormatter(
    address?.AddressLine1,
    address?.AddressLine2,
    address?.AddressLine3,
    address?.PostTown,
    address?.County,
    address?.PostCode,
    address?.Country
  );
  details.push(addSummaryRow(translations.address, addressString || translations.notProvided));

  details.push(addSummaryRow(translations.email, rep.representative_email_address || translations.notProvided));

  const validPreferences: string[] = [EmailOrPost.EMAIL, EmailOrPost.POST];
  if (rep.representative_preference && validPreferences.includes(rep.representative_preference)) {
    const preference = rep.representative_preference === EmailOrPost.EMAIL ? translations.email : translations.post;
    details.push(addSummaryRow(translations.preferredMethod, preference));
  }

  return details;
};

export const getAdditionalClaimantRows = (claimant: AdditionalClaimant, translations: AnyRecord): SummaryListRow[] => {
  const details: SummaryListRow[] = [];
  const nameParts = [claimant.title, claimant.firstName, claimant.lastName].filter(Boolean);
  details.push(addSummaryRow(translations.name, nameParts.length ? nameParts.join(' ') : translations.notProvided));

  const addressString = answersAddressFormatter(
    claimant.address?.AddressLine1,
    claimant.address?.AddressLine2,
    claimant.address?.AddressLine3,
    claimant.address?.PostTown,
    claimant.address?.County,
    claimant.address?.PostCode,
    claimant.address?.Country
  );
  details.push(addSummaryRow(translations.address, addressString || translations.notProvided));
  details.push(addSummaryRow(translations.email, claimant.email || translations.notProvided));

  return details;
};

export const getAdditionalClaimantsSummaryLists = (
  req: AppRequest,
  claimants: AdditionalClaimant[]
): { name: string; rows: SummaryListRow[] }[] => {
  const claimantsToUse = claimants ?? req.session?.userCase?.additionalClaimants;
  if (!claimantsToUse?.length) {
    return [];
  }
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.CLAIMANT_CONTACT_DETAILS, { returnObjects: true }),
  };
  return claimantsToUse.map((claimant, index) => ({
    name: `${translations.additionalClaimant} ${index + 2}`,
    rows: getAdditionalClaimantRows(claimant, translations),
  }));
};

const getClaimantInfo = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const details: SummaryListRow[] = [];

  details.push(addSummaryRow(translations.name, userCase.firstName + ' ' + userCase.lastName));

  const addressString = answersAddressFormatter(
    userCase.address1,
    userCase.address2,
    userCase.addressTown,
    userCase.addressPostcode,
    userCase.addressCountry
  );
  details.push(addSummaryRow(translations.address, addressString || translations.notProvided));

  details.push(addSummaryRow(translations.email, userCase.email || translations.notProvided));

  if (userCase.claimantContactPreference) {
    const preference =
      userCase.claimantContactPreference === EmailOrPost.EMAIL ? translations.email : translations.post;
    details.push(addSummaryRow(translations.preferredMethod, preference));
  }

  return details;
};
