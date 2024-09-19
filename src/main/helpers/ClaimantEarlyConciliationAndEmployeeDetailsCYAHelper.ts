import { CaseWithId } from '../definitions/case';
import { InterceptPaths, PageUrls } from '../definitions/constants';
import { SummaryListRow, addSummaryRow, createChangeAction } from '../definitions/govuk/govukSummaryList';
import { AnyRecord } from '../definitions/util-types';

export const getContactPreferencesDetails = (userCase: CaseWithId, translations: AnyRecord): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];

  rows.push(
    addSummaryRow(
      translations.disagreeEarlyConciliation.key,
      '[Yes / No]',
      createChangeAction(
        PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.disagreeEarlyConciliation.key
      )
    )
  );

  rows.push(
    addSummaryRow(
      translations.disagreeEarlyConciliationWhy.key,
      '[Answer / Not provided]',
      createChangeAction(
        PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.disagreeEarlyConciliationWhy.key
      )
    )
  );

  rows.push(
    addSummaryRow(
      translations.areDatesOfEmploymentCorrect.key,
      '[Answer / Not provided]',
      createChangeAction(
        PageUrls.CLAIMANT_EMPLOYMENT_DATES + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.areDatesOfEmploymentCorrect.key
      )
    )
  );

  rows.push(
    addSummaryRow(
      translations.employmentStartDate.key,
      '[Date / Not provided]',
      createChangeAction(
        PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.employmentStartDate.key
      )
    )
  );

  rows.push(
    addSummaryRow(
      translations.employmentEndDate.key,
      '[Date / Not provided]',
      createChangeAction(
        PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.employmentEndDate.key
      )
    )
  );

  rows.push(
    addSummaryRow(
      translations.employmentDatesFurtherInformation.key,
      '[Answer / Not provided]',
      createChangeAction(
        PageUrls.CLAIMANT_EMPLOYMENT_DATES_ENTER + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.employmentDatesFurtherInformation.key
      )
    )
  );

  rows.push(
    addSummaryRow(
      translations.isEmploymentContinuing.key,
      '[Yes / No / Not sure]',
      createChangeAction(
        PageUrls.IS_CLAIMANT_EMPLOYMENT_WITH_RESPONDENT_CONTINUING + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.isEmploymentContinuing.key
      )
    )
  );

  rows.push(
    addSummaryRow(
      translations.isClaimantJobTitleCorrect.key,
      '[Yes / No / Not sure]',
      createChangeAction(
        PageUrls.CLAIMANT_JOB_TITLE + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.isClaimantJobTitleCorrect.key
      )
    )
  );

  rows.push(
    addSummaryRow(
      translations.whatIsClaimantJobTitle.key,
      '[Answer / Not provided]',
      createChangeAction(
        PageUrls.CLAIMANT_JOB_TITLE + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.whatIsClaimantJobTitle.key
      )
    )
  );

  rows.push(
    addSummaryRow(
      translations.areWorkHourCorrect.key,
      '[Yes / No / Not sure]',
      createChangeAction(
        PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.areWorkHourCorrect.key
      )
    )
  );

  rows.push(
    addSummaryRow(
      translations.whatAreWorkHour.key,
      '[Answer / Not provided]',
      createChangeAction(
        PageUrls.CLAIMANT_AVERAGE_WEEKLY_WORK_HOURS + InterceptPaths.ANSWERS_CHANGE,
        translations.change,
        translations.whatAreWorkHour.key
      )
    )
  );

  return rows;
};
