import { AppRequest } from '../../definitions/appRequest';
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
import { Et1Address } from '../../definitions/complexTypes/et1Address';
import { DefaultValues, PageUrls } from '../../definitions/constants';
import {
  SummaryListRow,
  addSummaryHtmlRowWithAction,
  addSummaryRowWithAction,
} from '../../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../../definitions/util-types';
import AddressUtils from '../../utils/AddressUtils';
import DateUtils from '../../utils/DateUtils';
import DocumentUtils from '../../utils/DocumentUtils';
import RespondentUtils from '../../utils/RespondentUtils';
import { answersAddressFormatter } from '../AddressHelper';

export const getEt3Section1 = (
  request: AppRequest,
  translations: AnyRecord,
  sectionCya?: string,
  hideChangeLink?: boolean
): SummaryListRow[] => {
  const et3ResponseSection1: SummaryListRow[] = [];
  const userCase = request.session.userCase;
  et3ResponseSection1.push(
    addSummaryRowWithAction(
      translations.section1.respondentName,
      userCase.responseRespondentName ?? userCase.respondentName,
      PageUrls.RESPONDENT_NAME,
      hideChangeLink === true ? undefined : translations.change,
      hideChangeLink === true ? undefined : sectionCya
    ),
    addSummaryRowWithAction(
      translations.section1.organisationType,
      userCase.et3ResponseRespondentEmployerType ?? DefaultValues.STRING_DASH,
      PageUrls.TYPE_OF_ORGANISATION,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    )
  );

  if (userCase.et3ResponseRespondentEmployerType === TypeOfOrganisation.INDIVIDUAL) {
    et3ResponseSection1.push(
      addSummaryRowWithAction(
        translations.section1.preferredTitleOptional,
        userCase.et3ResponseRespondentPreferredTitle ?? DefaultValues.STRING_DASH,
        PageUrls.TYPE_OF_ORGANISATION,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
      )
    );
  }

  if (userCase.et3ResponseRespondentEmployerType === TypeOfOrganisation.LIMITED_COMPANY) {
    et3ResponseSection1.push(
      addSummaryRowWithAction(
        translations.section1.companyRegistrationNumberOptional,
        userCase.et3ResponseRespondentCompanyNumber ?? DefaultValues.STRING_DASH,
        PageUrls.TYPE_OF_ORGANISATION,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
      )
    );
  }
  const responseRespondentAddress: Et1Address =
    AddressUtils.findResponseRespondentAddressByEt3IsRespondentAddressCorrectField(
      userCase,
      RespondentUtils.findSelectedRespondentByRequest(request)
    );
  et3ResponseSection1.push(
    addSummaryRowWithAction(
      translations.section1.address,
      answersAddressFormatter(
        responseRespondentAddress?.AddressLine1,
        responseRespondentAddress?.AddressLine2,
        responseRespondentAddress?.AddressLine3,
        responseRespondentAddress?.PostTown,
        responseRespondentAddress?.County,
        responseRespondentAddress?.Country,
        responseRespondentAddress?.PostCode
      ),
      PageUrls.RESPONDENT_ADDRESS,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    ),
    addSummaryRowWithAction(
      translations.section1.contactName,
      userCase.et3ResponseRespondentContactName ?? DefaultValues.STRING_DASH,
      PageUrls.RESPONDENT_PREFERRED_CONTACT_NAME,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    ),
    addSummaryRowWithAction(
      translations.section1.dxAddressOptional,
      userCase.et3ResponseDXAddress ?? DefaultValues.STRING_DASH,
      PageUrls.RESPONDENT_DX_ADDRESS,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    ),
    addSummaryRowWithAction(
      translations.section1.contactNumberOptional,
      userCase.responseRespondentPhone1 ?? DefaultValues.STRING_DASH,
      PageUrls.RESPONDENT_CONTACT_PHONE_NUMBER,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    ),
    addSummaryRowWithAction(
      translations.section1.contactFormat,
      userCase.responseRespondentContactPreference === EmailOrPost.EMAIL
        ? translations.email
        : userCase.responseRespondentContactPreference === EmailOrPost.POST
        ? translations.post
        : DefaultValues.STRING_DASH,
      PageUrls.RESPONDENT_CONTACT_PREFERENCES,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    )
  );

  if (userCase.responseRespondentContactPreference === EmailOrPost.POST) {
    et3ResponseSection1.push(
      addSummaryRowWithAction(
        translations.section1.reasonForPost,
        userCase.et3ResponseContactReason,
        PageUrls.RESPONDENT_CONTACT_PREFERENCES,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
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
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
      )
    );
  }

  return et3ResponseSection1;
};

export const getEt3Section2 = (
  userCase: CaseWithId,
  translations: AnyRecord,
  sectionCya?: string,
  hideChangeLink?: boolean
): SummaryListRow[] => {
  const et3ResponseSection2: SummaryListRow[] = [];

  et3ResponseSection2.push(
    addSummaryRowWithAction(
      translations.section2.participateInHearings,
      getTranslationsForHearingPreferences(userCase, translations).join(', '),
      PageUrls.HEARING_PREFERENCES,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    )
  );

  et3ResponseSection2.push(
    addSummaryRowWithAction(
      translations.section2.disabilitySupport,
      translations[userCase.et3ResponseRespondentSupportNeeded] ?? DefaultValues.STRING_DASH,
      PageUrls.REASONABLE_ADJUSTMENTS,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    )
  );

  if (YesOrNoOrNotSure.YES === userCase.et3ResponseRespondentSupportNeeded) {
    et3ResponseSection2.push(
      addSummaryRowWithAction(
        translations.section2.supportRequest,
        userCase.et3ResponseRespondentSupportDetails,
        PageUrls.REASONABLE_ADJUSTMENTS,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
      )
    );
  }

  et3ResponseSection2.push(
    addSummaryRowWithAction(
      translations.section2.employeesInGreatBritain,
      userCase.et3ResponseEmploymentCount ?? DefaultValues.STRING_DASH,
      PageUrls.RESPONDENT_EMPLOYEES,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    ),
    addSummaryRowWithAction(
      translations.section2.multipleSites,
      translations[userCase.et3ResponseMultipleSites] ?? DefaultValues.STRING_DASH,
      PageUrls.RESPONDENT_SITES,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    ),
    addSummaryRowWithAction(
      translations.section2.employeesAtSite,
      userCase.et3ResponseSiteEmploymentCount ?? DefaultValues.STRING_DASH,
      PageUrls.RESPONDENT_SITE_EMPLOYEES,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    )
  );

  return et3ResponseSection2;
};

export const getEt3Section3 = (
  userCase: CaseWithId,
  translations: AnyRecord,
  sectionCya?: string,
  hideChangeLink?: boolean
): SummaryListRow[] => {
  const et3ResponseSection3: SummaryListRow[] = [];

  et3ResponseSection3.push(
    addSummaryRowWithAction(
      translations.section3.et3ResponseAcasAgree,
      translations[userCase.et3ResponseAcasAgree] ?? DefaultValues.STRING_DASH,
      PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    )
  );

  if (YesOrNo.NO === userCase.et3ResponseAcasAgree) {
    et3ResponseSection3.push(
      addSummaryRowWithAction(
        translations.section3.et3ResponseAcasAgreeReason,
        userCase.et3ResponseAcasAgreeReason ?? DefaultValues.STRING_DASH,
        PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
      )
    );
  }

  et3ResponseSection3.push(
    addSummaryRowWithAction(
      translations.section3.et3ResponseAreDatesCorrect,
      translations[userCase.et3ResponseAreDatesCorrect] ?? DefaultValues.STRING_DASH,
      PageUrls.CLAIMANT_EMPLOYMENT_DATES,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    )
  );

  if (YesOrNoOrNotApplicable.NO === userCase.et3ResponseAreDatesCorrect) {
    et3ResponseSection3.push(
      addSummaryRowWithAction(
        translations.section3.et3ResponseEmploymentStartDate,
        DateUtils.convertCaseDateToString(userCase.et3ResponseEmploymentStartDate) ?? DefaultValues.STRING_DASH,
        PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
      ),
      addSummaryRowWithAction(
        translations.section3.et3ResponseEmploymentEndDate,
        DateUtils.convertCaseDateToString(userCase.et3ResponseEmploymentEndDate) ?? DefaultValues.STRING_DASH,
        PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
      ),
      addSummaryRowWithAction(
        translations.section3.et3ResponseEmploymentInformation,
        userCase.et3ResponseEmploymentInformation ?? DefaultValues.STRING_DASH,
        PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
      )
    );
  }

  et3ResponseSection3.push(
    addSummaryRowWithAction(
      translations.section3.et3ResponseContinuingEmployment,
      translations[userCase.et3ResponseContinuingEmployment] ?? DefaultValues.STRING_DASH,
      PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    ),
    addSummaryRowWithAction(
      translations.section3.et3ResponseIsJobTitleCorrect,
      translations[userCase.et3ResponseIsJobTitleCorrect] ?? DefaultValues.STRING_DASH,
      PageUrls.CLAIMANT_JOB_TITLE,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    )
  );

  if (YesOrNoOrNotApplicable.NO === userCase.et3ResponseIsJobTitleCorrect) {
    et3ResponseSection3.push(
      addSummaryRowWithAction(
        translations.section3.et3ResponseCorrectJobTitle ?? DefaultValues.STRING_DASH,
        userCase.et3ResponseCorrectJobTitle,
        PageUrls.CLAIMANT_JOB_TITLE,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
      )
    );
  }

  et3ResponseSection3.push(
    addSummaryRowWithAction(
      translations.section3.et3ResponseClaimantWeeklyHours,
      translations[userCase.et3ResponseClaimantWeeklyHours] ?? DefaultValues.STRING_DASH,
      PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    )
  );

  if (YesOrNoOrNotApplicable.NO === userCase.et3ResponseClaimantWeeklyHours) {
    et3ResponseSection3.push(
      addSummaryRowWithAction(
        translations.section3.et3ResponseClaimantCorrectHours,
        userCase.et3ResponseClaimantCorrectHours ?? DefaultValues.STRING_DASH,
        PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
      )
    );
  }

  return et3ResponseSection3;
};

export const getEt3Section4 = (
  userCase: CaseWithId,
  translations: AnyRecord,
  sectionCya?: string,
  hideChangeLink?: boolean
): SummaryListRow[] => {
  const et3ResponseSection4: SummaryListRow[] = [];

  et3ResponseSection4.push(
    addSummaryRowWithAction(
      translations.section4.payDetailsCorrect,
      translations[userCase.et3ResponseEarningDetailsCorrect] ?? DefaultValues.STRING_DASH,
      PageUrls.CLAIMANT_PAY_DETAILS,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    )
  );

  if (YesOrNoOrNotApplicable.NO === userCase.et3ResponseEarningDetailsCorrect) {
    et3ResponseSection4.push(
      addSummaryRowWithAction(
        translations.section4.paymentFrequency,
        translations[userCase.et3ResponsePayFrequency] ?? DefaultValues.STRING_DASH,
        PageUrls.CLAIMANT_PAY_DETAILS_ENTER,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
      ),
      addSummaryRowWithAction(
        translations.section4.claimantsPayBeforeTax,
        userCase.et3ResponsePayBeforeTax ?? DefaultValues.STRING_DASH,
        PageUrls.CLAIMANT_PAY_DETAILS_ENTER,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
      ),
      addSummaryRowWithAction(
        translations.section4.claimantsPayAfterTax,
        userCase.et3ResponsePayTakehome ?? DefaultValues.STRING_DASH,
        PageUrls.CLAIMANT_PAY_DETAILS_ENTER,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
      )
    );
  }

  et3ResponseSection4.push(
    addSummaryRowWithAction(
      translations.section4.noticePeriodDetailsCorrect,
      translations[userCase.et3ResponseIsNoticeCorrect] ?? DefaultValues.STRING_DASH,
      PageUrls.CLAIMANT_NOTICE_PERIOD,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    )
  );

  if (YesOrNoOrNotApplicable.NO === userCase.et3ResponseIsNoticeCorrect) {
    et3ResponseSection4.push(
      addSummaryRowWithAction(
        translations.section4.noticePeriodDetails,
        userCase.et3ResponseCorrectNoticeDetails ?? DefaultValues.STRING_DASH,
        PageUrls.CLAIMANT_NOTICE_PERIOD,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
      )
    );
  }

  et3ResponseSection4.push(
    addSummaryRowWithAction(
      translations.section4.pensionAndBenefitsDetailsCorrect,
      translations[userCase.et3ResponseIsPensionCorrect] ?? DefaultValues.STRING_DASH,
      PageUrls.CLAIMANT_PENSION_AND_BENEFITS,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    )
  );

  if (YesOrNoOrNotApplicable.NO === userCase.et3ResponseIsPensionCorrect) {
    et3ResponseSection4.push(
      addSummaryRowWithAction(
        translations.section4.correctPensionAndBenefitsDetails,
        userCase.et3ResponsePensionCorrectDetails ?? DefaultValues.STRING_DASH,
        PageUrls.CLAIMANT_PENSION_AND_BENEFITS,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
      )
    );
  }

  return et3ResponseSection4;
};

export const getEt3Section5 = (
  userCase: CaseWithId,
  translations: AnyRecord,
  sectionCya?: string,
  hideChangeLink?: boolean
): SummaryListRow[] => {
  const et3ResponseSection5: SummaryListRow[] = [];

  et3ResponseSection5.push(
    addSummaryRowWithAction(
      translations.section5.contestClaim1 + userCase.respondentName + translations.section5.contestClaim2,
      translations[userCase.et3ResponseRespondentContestClaim],
      PageUrls.RESPONDENT_CONTEST_CLAIM,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    )
  );

  if (YesOrNo.YES === userCase.et3ResponseRespondentContestClaim) {
    const documents = userCase.et3ResponseContestClaimDocument;
    // Join the shortDescriptions with a comma
    // Generate HTML for individual document links
    const contestClaimDocumentLinks =
      userCase.et3ResponseContestClaimDocument !== undefined
        ? documents
            .map(
              document =>
                '<a href="getCaseDocument/' +
                document.id +
                '" target="_blank">' +
                document.value?.uploadedDocument?.document_filename +
                '</a>'
            )
            .join(DefaultValues.HTML_NEWLINE)
        : DefaultValues.STRING_DASH;

    et3ResponseSection5.push(
      addSummaryRowWithAction(
        translations.section5.contestExplanation1 + userCase.respondentName + translations.section5.contestExplanation2,
        userCase.et3ResponseContestClaimDetails,
        PageUrls.RESPONDENT_CONTEST_CLAIM_REASON ?? DefaultValues.STRING_DASH,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
      ),

      addSummaryHtmlRowWithAction(
        translations.section5.supportingMaterials,
        contestClaimDocumentLinks,
        PageUrls.RESPONDENT_CONTEST_CLAIM_REASON,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
      )
    );
  }

  return et3ResponseSection5;
};

export const getEt3Section6 = (
  userCase: CaseWithId,
  translations: AnyRecord,
  sectionCya?: string,
  hideChangeLink?: boolean
): SummaryListRow[] => {
  const et3ResponseSection6: SummaryListRow[] = [];

  et3ResponseSection6.push(
    addSummaryRowWithAction(
      translations.section6.respondentWantToMakeECC,
      translations[userCase.et3ResponseEmployerClaim ?? DefaultValues.STRING_DASH],
      PageUrls.EMPLOYERS_CONTRACT_CLAIM,
      hideChangeLink ? undefined : translations.change,
      hideChangeLink ? undefined : sectionCya
    )
  );

  if (YesOrNo.YES === userCase.et3ResponseEmployerClaim) {
    const employerClaimDocument =
      userCase.et3ResponseEmployerClaimDocument !== undefined
        ? '<a href="getCaseDocument/' +
          DocumentUtils.findDocumentIdByURL(userCase.et3ResponseEmployerClaimDocument.document_url) +
          '" target="_blank">' +
          userCase.et3ResponseEmployerClaimDocument.document_filename +
          '</a>'
        : DefaultValues.STRING_DASH;
    et3ResponseSection6.push(
      addSummaryRowWithAction(
        translations.section6.employerContractClaimDetails,
        userCase.et3ResponseEmployerClaimDetails ?? DefaultValues.STRING_DASH,
        PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
      ),
      addSummaryHtmlRowWithAction(
        translations.section6.supportingMaterials,
        employerClaimDocument,
        PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS,
        hideChangeLink ? undefined : translations.change,
        hideChangeLink ? undefined : sectionCya
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
