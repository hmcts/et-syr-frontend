import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { GovUKTaskListItem } from '../../definitions/govuk/govukTaskList';
import { linkStatusColorMap } from '../../definitions/links';
import {
  DEFAULT_REP_TASK_STATUS,
  REP_RESPONSE_TASKS_BY_SECTION,
  RepResponseTaskKey,
  SectionConfig,
} from '../../definitions/rep-response-tasks';
import { AnyRecord } from '../../definitions/util-types';
import { baseUrls, shouldCaseDetailsLinkBeClickable } from '../ResponseHubHelper';
import { getLanguageParam } from '../RouterHelpers';

const getRepResponseLinksUrlMap = (languageParam: string): Map<string, string> => {
  // TODO: Add other tasks link when they are implemented
  return new Map<string, string>([
    [
      RepResponseTaskKey.ConciliationAndEmployeeDetails,
      PageUrls.ACAS_EARLY_CONCILIATION_CERTIFICATE + baseUrls[languageParam],
    ],
    [RepResponseTaskKey.PayPensionBenefitDetails, PageUrls.CLAIMANT_PAY_DETAILS + baseUrls[languageParam]],
    [RepResponseTaskKey.ContestClaim, PageUrls.RESPONDENT_CONTEST_CLAIM + baseUrls[languageParam]],
    [RepResponseTaskKey.EmployersContractClaim, PageUrls.EMPLOYERS_CONTRACT_CLAIM + baseUrls[languageParam]],
    [RepResponseTaskKey.CheckYourAnswers, PageUrls.CHECK_YOUR_ANSWERS_ET3 + baseUrls[languageParam]],
  ]);
};

interface Section {
  title: string;
  items: GovUKTaskListItem[];
}

const buildItem = (
  taskKey: RepResponseTaskKey,
  statusTranslations: AnyRecord,
  taskTranslations: AnyRecord,
  languageParam: string
): GovUKTaskListItem => {
  const status = DEFAULT_REP_TASK_STATUS[taskKey]; // TODO

  const title = {
    text: taskTranslations[taskKey],
  };

  const isCompleted: boolean = false; // TODO
  const statusText: string = statusTranslations[status];
  const statusClass: string = 'govuk-tag' + linkStatusColorMap.get(status);
  const statusItem = isCompleted
    ? {
        text: statusText,
      }
    : {
        tag: {
          text: statusText,
          classes: statusClass,
        },
      };

  const shouldLinkClickable: boolean = shouldCaseDetailsLinkBeClickable(status);
  return shouldLinkClickable
    ? {
        title,
        href: getRepResponseLinksUrlMap(languageParam).get(taskKey),
        status: statusItem,
      }
    : {
        title,
        status: statusItem,
      };
};

const buildSection = (
  sectionConfig: SectionConfig,
  statusTranslations: AnyRecord,
  listTranslations: AnyRecord,
  languageParam: string
): Section => {
  const sectionTranslations = listTranslations[sectionConfig.section];
  return {
    title: sectionTranslations.heading,
    items: sectionConfig.tasks.map(taskKey =>
      buildItem(taskKey, statusTranslations, sectionTranslations, languageParam)
    ),
  };
};

export const buildRepTaskListSections = (req: AppRequest): Section[] => {
  const statusTranslations: AnyRecord = {
    ...req.t(TranslationKeys.CASE_DETAILS_STATUS as never, { returnObjects: true } as never),
  };

  const listTranslations: AnyRecord = {
    ...req.t(TranslationKeys.REP_RESPONSE_TASK_LIST as never, { returnObjects: true } as never),
  };

  const languageParam = getLanguageParam(req.url);

  return REP_RESPONSE_TASKS_BY_SECTION.map(sectionConfig =>
    buildSection(sectionConfig, statusTranslations, listTranslations, languageParam)
  );
};
