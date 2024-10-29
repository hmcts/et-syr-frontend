import {
  CaseWithId,
  EmailOrPost,
  EnglishOrWelsh,
  HearingPreferenceET3,
  TypeOfOrganisation,
  YesOrNo,
  YesOrNoOrNotApplicable,
  YesOrNoOrNotSure,
} from '../../definitions/case';
import { DefaultValues, PageUrls } from '../../definitions/constants';
import { SummaryListRow, addSummaryRowWithAction } from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import { answersAddressFormatter } from '../AddressHelper';

export const getEt3Section1 = (
  userCase: CaseWithId,
  translations: AnyRecord,
  sectionCya?: string
): SummaryListRow[] => {
  const et3ResponseSection1: SummaryListRow[] = [];

  et3ResponseSection1.push(
    addSummaryRowWithAction(
      translations.section1.respondentName,
      userCase.responseRespondentName ?? userCase.respondentName,
      PageUrls.RESPONDENT_NAME,
      translations.change,
      sectionCya
    ),
    addSummaryRowWithAction(
      translations.section1.organisationType,
      userCase.et3ResponseRespondentEmployerType ?? translations.notProvided,
      PageUrls.TYPE_OF_ORGANISATION,
      translations.change,
      sectionCya
    )
  );

  if (userCase.et3ResponseRespondentEmployerType === TypeOfOrganisation.INDIVIDUAL) {
    et3ResponseSection1.push(
      addSummaryRowWithAction(
        translations.section1.preferredTitleOptional,
        userCase.et3ResponseRespondentPreferredTitle ?? '-',
        PageUrls.TYPE_OF_ORGANISATION,
        translations.change,
        sectionCya
      )
    );
  }

  if (userCase.et3ResponseRespondentEmployerType === TypeOfOrganisation.LIMITED_COMPANY) {
    et3ResponseSection1.push(
      addSummaryRowWithAction(
        translations.section1.companyRegistrationNumberOptional,
        userCase.et3ResponseRespondentCompanyNumber ?? '-',
        PageUrls.TYPE_OF_ORGANISATION,
        translations.change,
        sectionCya
      )
    );
  }

  et3ResponseSection1.push(
    addSummaryRowWithAction(
      translations.section1.address,
      answersAddressFormatter(
        userCase.responseRespondentAddressLine1,
        userCase.responseRespondentAddressLine2,
        userCase.responseRespondentAddressLine3,
        userCase.responseRespondentAddressPostTown,
        userCase.responseRespondentAddressCounty,
        userCase.responseRespondentAddressCountry,
        userCase.responseRespondentAddressPostCode
      ),
      PageUrls.RESPONDENT_ADDRESS,
      translations.change,
      sectionCya
    ),
    addSummaryRowWithAction(
      translations.section1.contactName,
      userCase.et3ResponseRespondentContactName ?? '-',
      PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME,
      translations.change,
      sectionCya
    ),
    addSummaryRowWithAction(
      translations.section1.dxAddressOptional,
      userCase.et3ResponseDXAddress ?? '-',
      PageUrls.RESPONDENT_DX_ADDRESS,
      translations.change,
      sectionCya
    ),
    addSummaryRowWithAction(
      translations.section1.contactNumberOptional,
      userCase.responseRespondentPhone1 ?? '-',
      PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER,
      translations.change,
      sectionCya
    ),
    addSummaryRowWithAction(
      translations.section1.contactFormat,
      userCase.responseRespondentContactPreference === EmailOrPost.EMAIL
        ? translations.email
        : userCase.responseRespondentContactPreference === EmailOrPost.POST
        ? translations.post
        : DefaultValues.STRING_DASH,
      PageUrls.RESPONDENT_CONTACT_PREFERENCES,
      translations.change,
      sectionCya
    )
  );

  if (userCase.responseRespondentContactPreference === EmailOrPost.POST) {
    et3ResponseSection1.push(
      addSummaryRowWithAction(
        translations.section1.reasonForPost,
        userCase.et3ResponseContactReason,
        PageUrls.RESPONDENT_CONTACT_PREFERENCES,
        translations.change,
        sectionCya
      )
    );
  }

  if (userCase.managingOffice !== 'Scotland') {
    et3ResponseSection1.push(
      addSummaryRowWithAction(
        translations.section1.contactLanguage,
        userCase.et3ResponseLanguagePreference === EnglishOrWelsh.ENGLISH
          ? translations.english
          : userCase.et3ResponseLanguagePreference === EnglishOrWelsh.WELSH
          ? translations.welsh
          : DefaultValues.STRING_DASH,
        PageUrls.RESPONDENT_CONTACT_PREFERENCES,
        translations.change,
        sectionCya
      )
    );
  }

  return et3ResponseSection1;
};

export const getEt3Section2 = (
  userCase: CaseWithId,
  translations: AnyRecord,
  sectionCya?: string
): SummaryListRow[] => {
  const et3ResponseSection2: SummaryListRow[] = [];

  et3ResponseSection2.push(
    addSummaryRowWithAction(
      translations.section2.participateInHearings,
      getTranslationsForHearingPreferences(userCase, translations).join(', '),
      PageUrls.HEARING_PREFERENCES,
      translations.change,
      sectionCya
    )
  );

  et3ResponseSection2.push(
    addSummaryRowWithAction(
      translations.section2.disabilitySupport,
      translations[userCase.et3ResponseRespondentSupportNeeded] ?? '-',
      PageUrls.REASONABLE_ADJUSTMENTS,
      translations.change,
      sectionCya
    )
  );

  if (YesOrNoOrNotSure.YES === userCase.et3ResponseRespondentSupportNeeded) {
    et3ResponseSection2.push(
      addSummaryRowWithAction(
        translations.section2.supportRequest,
        userCase.et3ResponseRespondentSupportDetails,
        PageUrls.REASONABLE_ADJUSTMENTS,
        translations.change,
        sectionCya
      )
    );
  }

  et3ResponseSection2.push(
    addSummaryRowWithAction(
      translations.section2.employeesInGreatBritain,
      userCase.et3ResponseEmploymentCount ?? '-',
      PageUrls.RESPONDENT_EMPLOYEES,
      translations.change,
      sectionCya
    ),
    addSummaryRowWithAction(
      translations.section2.multipleSites,
      translations[userCase.et3ResponseMultipleSites] ?? '-',
      PageUrls.RESPONDENT_SITES,
      translations.change,
      sectionCya
    ),
    addSummaryRowWithAction(
      translations.section2.employeesAtSite,
      userCase.et3ResponseSiteEmploymentCount ?? '-',
      PageUrls.RESPONDENT_SITE_EMPLOYEES,
      translations.change,
      sectionCya
    )
  );

  return et3ResponseSection2;
};

export const getEt3Section3 = (
  userCase: CaseWithId,
  translations: AnyRecord,
  sectionCya?: string
): SummaryListRow[] => {
  const et3ResponseSection3: SummaryListRow[] = [];

  et3ResponseSection3.push(
    addSummaryRowWithAction(
      translations.section3.et3ResponseAcasAgree,
      translations[userCase.et3ResponseAcasAgree] ?? '-',
      PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE,
      translations.change,
      sectionCya
    )
  );

  if (YesOrNo.NO === userCase.et3ResponseAcasAgree) {
    et3ResponseSection3.push(
      addSummaryRowWithAction(
        translations.section3.et3ResponseAcasAgreeReason,
        userCase.et3ResponseAcasAgreeReason ?? '-',
        PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE,
        translations.change,
        sectionCya
      )
    );
  }

  et3ResponseSection3.push(
    addSummaryRowWithAction(
      translations.section3.et3ResponseAreDatesCorrect,
      translations[userCase.et3ResponseAreDatesCorrect] ?? '-',
      PageUrls.CLAIMANT_EMPLOYMENT_DATES,
      translations.change,
      sectionCya
    )
  );

  if (YesOrNoOrNotApplicable.NO === userCase.et3ResponseAreDatesCorrect) {
    et3ResponseSection3.push(
      addSummaryRowWithAction(
        translations.section3.et3ResponseEmploymentStartDate,
        userCase.et3ResponseEmploymentStartDate ?? '-',
        PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER,
        translations.change,
        sectionCya
      ),
      addSummaryRowWithAction(
        translations.section3.et3ResponseEmploymentEndDate,
        userCase.et3ResponseEmploymentEndDate ?? '-',
        PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER,
        translations.change,
        sectionCya
      ),
      addSummaryRowWithAction(
        translations.section3.et3ResponseEmploymentInformation,
        userCase.et3ResponseEmploymentInformation ?? '-',
        PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER,
        translations.change,
        sectionCya
      )
    );
  }

  et3ResponseSection3.push(
    addSummaryRowWithAction(
      translations.section3.et3ResponseContinuingEmployment,
      translations[userCase.et3ResponseContinuingEmployment] ?? '-',
      PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING,
      translations.change,
      sectionCya
    ),
    addSummaryRowWithAction(
      translations.section3.et3ResponseIsJobTitleCorrect,
      translations[userCase.et3ResponseIsJobTitleCorrect] ?? '-',
      PageUrls.CLAIMANT_JOB_TITLE,
      translations.change,
      sectionCya
    )
  );

  if (YesOrNoOrNotApplicable.NO === userCase.et3ResponseIsJobTitleCorrect) {
    et3ResponseSection3.push(
      addSummaryRowWithAction(
        translations.section3.et3ResponseCorrectJobTitle ?? '-',
        userCase.et3ResponseCorrectJobTitle,
        PageUrls.CLAIMANT_JOB_TITLE,
        translations.change,
        sectionCya
      )
    );
  }

  et3ResponseSection3.push(
    addSummaryRowWithAction(
      translations.section3.et3ResponseClaimantWeeklyHours,
      translations[userCase.et3ResponseClaimantWeeklyHours] ?? '-',
      PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS,
      translations.change,
      sectionCya
    )
  );

  if (YesOrNoOrNotApplicable.NO === userCase.et3ResponseClaimantWeeklyHours) {
    et3ResponseSection3.push(
      addSummaryRowWithAction(
        translations.section3.et3ResponseClaimantCorrectHours,
        userCase.et3ResponseClaimantCorrectHours ?? '-',
        PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS,
        translations.change,
        sectionCya
      )
    );
  }

  return et3ResponseSection3;
};

export const getEt3Section4 = (
  userCase: CaseWithId,
  translations: AnyRecord,
  sectionCya?: string
): SummaryListRow[] => {
  const et3ResponseSection4: SummaryListRow[] = [];

  et3ResponseSection4.push(
    addSummaryRowWithAction(
      translations.section4.payDetailsCorrect,
      translations[userCase.et3ResponseEarningDetailsCorrect] ?? '-',
      PageUrls.CLAIMANT_PAY_DETAILS,
      translations.change,
      sectionCya
    )
  );

  if (YesOrNoOrNotApplicable.NO === userCase.et3ResponseEarningDetailsCorrect) {
    et3ResponseSection4.push(
      addSummaryRowWithAction(
        translations.section4.paymentFrequency,
        translations[userCase.et3ResponsePayFrequency] ?? '-',
        PageUrls.CLAIMANT_PAY_DETAILS_ENTER,
        translations.change,
        sectionCya
      ),
      addSummaryRowWithAction(
        translations.section4.claimantsPayBeforeTax,
        userCase.et3ResponsePayBeforeTax ?? '-',
        PageUrls.CLAIMANT_PAY_DETAILS_ENTER,
        translations.change,
        sectionCya
      ),
      addSummaryRowWithAction(
        translations.section4.claimantsPayAfterTax,
        userCase.et3ResponsePayTakehome ?? '-',
        PageUrls.CLAIMANT_PAY_DETAILS_ENTER,
        translations.change,
        sectionCya
      )
    );
  }

  et3ResponseSection4.push(
    addSummaryRowWithAction(
      translations.section4.noticePeriodDetailsCorrect,
      translations[userCase.et3ResponseIsNoticeCorrect] ?? '-',
      PageUrls.CLAIMANT_NOTICE_PERIOD,
      translations.change,
      sectionCya
    )
  );

  if (YesOrNoOrNotApplicable.NO === userCase.et3ResponseIsNoticeCorrect) {
    et3ResponseSection4.push(
      addSummaryRowWithAction(
        translations.section4.noticePeriodDetails,
        userCase.et3ResponseCorrectNoticeDetails ?? '-',
        PageUrls.CLAIMANT_NOTICE_PERIOD,
        translations.change,
        sectionCya
      )
    );
  }

  et3ResponseSection4.push(
    addSummaryRowWithAction(
      translations.section4.pensionAndBenefitsDetailsCorrect,
      translations[userCase.et3ResponseIsPensionCorrect] ?? '-',
      PageUrls.CLAIMANT_PENSION_AND_BENEFITS,
      translations.change,
      sectionCya
    )
  );

  if (YesOrNoOrNotApplicable.NO === userCase.et3ResponseIsPensionCorrect) {
    et3ResponseSection4.push(
      addSummaryRowWithAction(
        translations.section4.correctPensionAndBenefitsDetails,
        userCase.et3ResponsePensionCorrectDetails ?? '-',
        PageUrls.CLAIMANT_PENSION_AND_BENEFITS,
        translations.change,
        sectionCya
      )
    );
  }

  return et3ResponseSection4;
};

export const getEt3Section5 = (
  userCase: CaseWithId,
  translations: AnyRecord,
  sectionCya?: string
): SummaryListRow[] => {
  const et3ResponseSection5: SummaryListRow[] = [];

  et3ResponseSection5.push(
    addSummaryRowWithAction(
      translations.section5.contestClaim1 + userCase.respondentName + translations.section5.contestClaim2,
      translations[userCase.et3ResponseRespondentContestClaim],
      PageUrls.RESPONDENT_CONTEST_CLAIM,
      translations.change,
      sectionCya
    )
  );

  if (YesOrNo.YES === userCase.et3ResponseRespondentContestClaim) {
    et3ResponseSection5.push(
      addSummaryRowWithAction(
        translations.section5.contestExplanation1 + userCase.respondentName + translations.section5.contestExplanation2,
        userCase.et3ResponseContestClaimDetails,
        PageUrls.RESPONDENT_CONTEST_CLAIM_REASON ?? '-',
        translations.change,
        sectionCya
      ),
      addSummaryRowWithAction(
        translations.section5.supportingMaterials,
        translations.section5.exampleData, // todo: populate with the correct field from userCase
        PageUrls.RESPONDENT_CONTEST_CLAIM_REASON,
        translations.change,
        sectionCya
      )
    );
  }

  return et3ResponseSection5;
};

export const getEt3Section6 = (
  userCase: CaseWithId,
  translations: AnyRecord,
  sectionCya?: string
): SummaryListRow[] => {
  const et3ResponseSection6: SummaryListRow[] = [];

  et3ResponseSection6.push(
    addSummaryRowWithAction(
      translations.section6.respondentWantToMakeECC,
      translations[userCase.et3ResponseEmployerClaim ?? '-'],
      PageUrls.EMPLOYERS_CONTRACT_CLAIM,
      translations.change,
      sectionCya
    )
  );

  if (YesOrNo.YES === userCase.et3ResponseEmployerClaim) {
    et3ResponseSection6.push(
      addSummaryRowWithAction(
        translations.section6.employerContractClaimDetails,
        userCase.et3ResponseEmployerClaimDetails ?? '-',
        PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS,
        translations.change,
        sectionCya
      ),
      addSummaryRowWithAction(
        translations.section6.supportingMaterials,
        translations.section6.exampleData, // todo: populate with the correct field from userCase
        PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS,
        translations.change,
        sectionCya
      )
    );
  }

  return et3ResponseSection6;
};

const getTranslationsForHearingPreferences = function (userCase: CaseWithId, translations: AnyRecord) {
  const hearingPreferences: string[] = [];
  if (userCase.et3ResponseHearingRespondent !== undefined) {
    userCase.et3ResponseHearingRespondent.forEach(function (item) {
      if (item === HearingPreferenceET3.VIDEO) {
        hearingPreferences.push(translations.hearings.video);
      }
      if (item === HearingPreferenceET3.PHONE) {
        hearingPreferences.push(translations.hearings.phone);
      }
    });
  } else {
    hearingPreferences.push(translations.notProvided);
  }
  return hearingPreferences;
};
