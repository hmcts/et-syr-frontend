import { AppRequest } from '../../definitions/appRequest';
import { TranslationKeys } from '../../definitions/constants';
import { GovUKTaskListItem } from '../../definitions/govuk/govukTaskList';
import { linkStatusColorMap } from '../../definitions/links';
import { AnyRecord } from '../../definitions/util-types';
import {
  DEFAULT_REP_TASK_STATUS,
  REP_ET3_TASKS_BY_SECTION,
  RepET3TaskKey,
  SectionConfig,
  getRepET3LinksUrlMap,
} from '../RepET3SectionHelper';
import { shouldCaseDetailsLinkBeClickable } from '../ResponseHubHelper';
import { getLanguageParam } from '../RouterHelpers';

interface Section {
  title: string;
  items: GovUKTaskListItem[];
}

const buildItem = (
  taskKey: RepET3TaskKey,
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
        href: getRepET3LinksUrlMap(languageParam).get(taskKey),
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

  return REP_ET3_TASKS_BY_SECTION.map(sectionConfig =>
    buildSection(sectionConfig, statusTranslations, listTranslations, languageParam)
  );
};
