import { CaseWithId, YesOrNo, YesOrNoOrNotSure } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';
import { SummaryListRow, addSummaryRowWithAction } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';

export const getEt3Section1 = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const et3ResponseSection1: SummaryListRow[] = [];

  et3ResponseSection1.push(
    addSummaryRowWithAction(
      translations.section1.respondentName,
      translations.section1.exampleData, // todo: this is the data field that needs to be populated
      PageUrls.RESPONDENT_NAME,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section1.organisationType,
      translations.section1.exampleData, // todo: this is the data field that needs to be populated
      PageUrls.TYPE_OF_ORGANISATION,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section1.preferredTitleOptional,
      translations.section1.exampleData, // todo: this is the data field that needs to be populated
      PageUrls.TYPE_OF_ORGANISATION,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section1.companyRegistrationNumberOptional,
      translations.section1.exampleData, // todo: this is the data field that needs to be populated
      PageUrls.TYPE_OF_ORGANISATION,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section1.address,
      translations.section1.exampleData, // todo: this is the data field that needs to be populated
      PageUrls.RESPONDENT_ADDRESS,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section1.contactName,
      translations.section1.exampleData, // todo: this is the data field that needs to be populated
      PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section1.dxAddressOptional,
      translations.section1.exampleData, // todo: this is the data field that needs to be populated
      PageUrls.RESPONDENT_DX_ADDRESS,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section1.contactNumberOptional,
      translations.section1.exampleData, // todo: this is the data field that needs to be populated
      PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section1.contactFormat,
      translations.section1.exampleData, // todo: this is the data field that needs to be populated
      PageUrls.RESPONDENT_CONTACT_PREFERENCES,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section1.reasonForPost,
      translations.section1.exampleData, // todo: this is the data field that needs to be populated
      PageUrls.RESPONDENT_CONTACT_PREFERENCES,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section1.contactLanguage,
      translations.section1.exampleData, // todo: this is the data field that needs to be populated
      PageUrls.RESPONDENT_CONTACT_PREFERENCES,
      translations.change
    )
  );

  return et3ResponseSection1;
};

export const getEt3Section2 = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const et3ResponseSection2: SummaryListRow[] = [];

  et3ResponseSection2.push(
    addSummaryRowWithAction(
      translations.section2.participateInHearings,
      translations.section2.exampleData, // todo: populate with the correct field from userCase
      PageUrls.HEARING_PREFERENCES,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section2.explainReason,
      translations.section2.exampleData, // todo: populate with the correct field from userCase
      PageUrls.HEARING_PREFERENCES,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section2.disabilitySupport,
      translations.section2.exampleData, // todo: populate with the correct field from userCase
      PageUrls.REASONABLE_ADJUSTMENTS,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section2.supportRequest,
      translations.section2.exampleData, // todo: populate with the correct field from userCase
      PageUrls.REASONABLE_ADJUSTMENTS,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section2.employeesInGreatBritain,
      translations.section2.exampleData, // todo: populate with the correct field from userCase
      PageUrls.RESPONDENT_EMPLOYEES,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section2.multipleSites,
      translations.section2.exampleData, // todo: populate with the correct field from userCase
      PageUrls.RESPONDENT_SITES,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section2.employeesAtSite,
      translations.section2.exampleData, // todo: populate with the correct field from userCase
      PageUrls.RESPONDENT_SITE_EMPLOYEES,
      translations.change
    )
  );

  return et3ResponseSection2;
};

export const getEt3Section3 = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const et3ResponseSection3: SummaryListRow[] = [];

  et3ResponseSection3.push(
    addSummaryRowWithAction(
      translations.section3.et3ResponseAcasAgree,
      translations[userCase.et3ResponseAcasAgree],
      PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE,
      translations.change
    )
  );

  if (YesOrNo.YES === userCase.et3ResponseAcasAgree) {
    et3ResponseSection3.push(
      addSummaryRowWithAction(
        translations.section3.et3ResponseAcasAgreeReason,
        userCase.et3ResponseAcasAgreeReason,
        PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE,
        translations.change
      )
    );
  }

  et3ResponseSection3.push(
    addSummaryRowWithAction(
      translations.section3.et3ResponseAreDatesCorrect,
      translations[userCase.et3ResponseAreDatesCorrect],
      PageUrls.CLAIMANT_EMPLOYMENT_DATES,
      translations.change
    )
  );

  if (YesOrNoOrNotSure.NO === userCase.et3ResponseAreDatesCorrect) {
    et3ResponseSection3.push(
      addSummaryRowWithAction(
        translations.section3.et3ResponseEmploymentStartDate,
        userCase.et3ResponseEmploymentStartDate,
        PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER,
        translations.change
      ),
      addSummaryRowWithAction(
        translations.section3.et3ResponseEmploymentEndDate,
        userCase.et3ResponseEmploymentEndDate,
        PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER,
        translations.change
      ),
      addSummaryRowWithAction(
        translations.section3.et3ResponseEmploymentInformation,
        userCase.et3ResponseEmploymentInformation,
        PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER,
        translations.change
      )
    );
  }

  et3ResponseSection3.push(
    addSummaryRowWithAction(
      translations.section3.et3ResponseContinuingEmployment,
      translations[userCase.et3ResponseContinuingEmployment],
      PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section3.et3ResponseIsJobTitleCorrect,
      translations[userCase.et3ResponseIsJobTitleCorrect],
      PageUrls.CLAIMANT_JOB_TITLE,
      translations.change
    )
  );

  if (YesOrNoOrNotSure.NO === userCase.et3ResponseIsJobTitleCorrect) {
    et3ResponseSection3.push(
      addSummaryRowWithAction(
        translations.section3.et3ResponseCorrectJobTitle,
        userCase.et3ResponseCorrectJobTitle,
        PageUrls.CLAIMANT_JOB_TITLE,
        translations.change
      )
    );
  }

  et3ResponseSection3.push(
    addSummaryRowWithAction(
      translations.section3.et3ResponseClaimantWeeklyHours,
      translations[userCase.et3ResponseClaimantWeeklyHours],
      PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS,
      translations.change
    )
  );

  if (YesOrNoOrNotSure.NO === userCase.et3ResponseClaimantWeeklyHours) {
    et3ResponseSection3.push(
      addSummaryRowWithAction(
        translations.section3.et3ResponseClaimantCorrectHours,
        userCase.et3ResponseClaimantCorrectHours,
        PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS,
        translations.change
      )
    );
  }

  return et3ResponseSection3;
};

export const getEt3Section4 = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const et3ResponseSection4: SummaryListRow[] = [];

  et3ResponseSection4.push(
    addSummaryRowWithAction(
      translations.section4.payDetailsCorrect,
      translations.section4.exampleData, // todo: populate with the correct field from userCase
      PageUrls.CLAIMANT_PAY_DETAILS,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section4.correctPayDetails,
      translations.section4.exampleData, // todo: populate with the correct field from userCase
      PageUrls.CLAIMANT_PAY_DETAILS,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section4.paymentFrequency,
      translations.section4.exampleData, // todo: populate with the correct field from userCase
      PageUrls.CLAIMANT_PAY_DETAILS_ENTER,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section4.claimantsPayBeforeTax,
      translations.section4.exampleData, // todo: populate with the correct field from userCase
      PageUrls.CLAIMANT_PAY_DETAILS_ENTER,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section4.claimantsPayAfterTax,
      translations.section4.exampleData, // todo: populate with the correct field from userCase
      PageUrls.CLAIMANT_PAY_DETAILS_ENTER,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section4.noticePeriodDetailsCorrect,
      translations.section4.exampleData, // todo: populate with the correct field from userCase
      PageUrls.CLAIMANT_NOTICE_PERIOD,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section4.pensionAndBenefitsDetailsCorrect,
      translations.section4.exampleData, // todo: populate with the correct field from userCase
      PageUrls.NOT_IMPLEMENTED, // todo: update with the correct URL
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section4.correctPensionAndBenefitsDetails,
      translations.section4.exampleData, // todo: populate with the correct field from userCase
      PageUrls.NOT_IMPLEMENTED, //CLAIMANT_PENSION_AND_BENEFITS_DETAILS??
      translations.change
    )
  );

  return et3ResponseSection4;
};

export const getEt3Section5 = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const et3ResponseSection5: SummaryListRow[] = [];

  et3ResponseSection5.push(
    addSummaryRowWithAction(
      translations.section5.contestClaim,
      translations.section5.exampleData, // todo: populate with the correct field from userCase
      PageUrls.RESPONDENT_CONTEST_CLAIM,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section5.contestExplanation,
      translations.section5.exampleData, // todo: populate with the correct field from userCase
      PageUrls.RESPONDENT_CONTEST_CLAIM_REASON,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section5.supportingMaterials,
      translations.section5.exampleData, // todo: populate with the correct field from userCase
      PageUrls.RESPONDENT_CONTEST_CLAIM_REASON,
      translations.change
    )
  );

  return et3ResponseSection5;
};

export const getEt3Section6 = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const et3ResponseSection6: SummaryListRow[] = [];

  et3ResponseSection6.push(
    addSummaryRowWithAction(
      translations.section6.respondentWantToMakeECC,
      translations.section6.exampleData, // todo: populate with the correct field from userCase
      PageUrls.EMPLOYERS_CONTRACT_CLAIM,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section6.employerContractClaimDetails,
      translations.section6.exampleData, // todo: populate with the correct field from userCase
      PageUrls.NOT_IMPLEMENTED,
      translations.change
    ),
    addSummaryRowWithAction(
      translations.section6.supportingMaterials,
      translations.section6.exampleData, // todo: populate with the correct field from userCase
      PageUrls.NOT_IMPLEMENTED,
      translations.change
    )
  );

  return et3ResponseSection6;
};
