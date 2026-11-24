import { AppRequest } from '../../definitions/appRequest';
import { RespondentET3Model } from '../../definitions/case';
import { TranslationKeys } from '../../definitions/constants';
import { GovUKTaskListItem } from '../../definitions/govuk/govukTaskList';
import {
  ET3HubLinksStatuses,
  getResponseHubLinkStatusesByRespondentHubLinkStatuses,
  linkStatusColorMap,
} from '../../definitions/links';
import { AnyRecord } from '../../definitions/util-types';
import { getET3HubLinksUrlMap, shouldCaseDetailsLinkBeClickable } from '../ResponseHubHelper';
import { getLanguageParam } from '../RouterHelpers';

interface Section {
  title: string;
  items: GovUKTaskListItem[];
}

export enum ET3TaskLinkNamesForRep {
  ContactDetails = 'contactDetails',
  EmployerDetails = 'employerDetails',
  ConciliationAndEmployeeDetails = 'conciliationAndEmployeeDetails',
  PayPensionBenefitDetails = 'payPensionBenefitDetails',
  ContestClaim = 'contestClaim',
  EmployersContractClaim = 'employersContractClaim',
  CheckYorAnswers = 'checkYorAnswers',
}

const ET3TaskListSectionForRep: ET3TaskLinkNamesForRep[][] = [
  [ET3TaskLinkNamesForRep.ContactDetails, ET3TaskLinkNamesForRep.EmployerDetails],
  [ET3TaskLinkNamesForRep.ConciliationAndEmployeeDetails, ET3TaskLinkNamesForRep.PayPensionBenefitDetails],
  [ET3TaskLinkNamesForRep.ContestClaim, ET3TaskLinkNamesForRep.EmployersContractClaim],
  [ET3TaskLinkNamesForRep.CheckYorAnswers],
];

const getSectionItems = (
  et3HubLinksStatuses: ET3HubLinksStatuses,
  linkName: ET3TaskLinkNamesForRep,
  translations: AnyRecord,
  languageParam: string
): GovUKTaskListItem => {
  const status = et3HubLinksStatuses[linkName];
  const shouldLinkClickable: boolean = shouldCaseDetailsLinkBeClickable(status);
  const isCompleted: boolean = true;
  const title = {
    text: translations[linkName],
  };
  const statusItem = isCompleted
    ? {
        text: '',
      }
    : {
        text: translations[status],
        classes: 'govuk-tag' + linkStatusColorMap.get(status),
      };
  return shouldLinkClickable
    ? {
        title,
        href: getET3HubLinksUrlMap(languageParam).get(linkName),
        status: statusItem,
      }
    : {
        title,
        status: statusItem,
      };
};

const getSection = (
  index: number,
  translations: AnyRecord,
  et3HubLinksStatuses: ET3HubLinksStatuses,
  languageParam: string
): Section => {
  return {
    title: translations[`section${index + 1}`],
    items: ET3TaskListSectionForRep[index].map(linkName =>
      getSectionItems(et3HubLinksStatuses, linkName, translations, languageParam)
    ),
  };
};

export const getTaskSectionsForRep = (selectedRespondent: RespondentET3Model, req: AppRequest): Section[] => {
  const languageParam = getLanguageParam(req.url);
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
    ...req.t(TranslationKeys.CASE_DETAILS_STATUS as never, { returnObjects: true } as never),
    ...req.t(TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST as never, { returnObjects: true } as never),
    ...req.t(TranslationKeys.REP_RESPONSE_TASK_LIST as never, { returnObjects: true } as never),
  };
  const et3HubLinksStatuses = getResponseHubLinkStatusesByRespondentHubLinkStatuses(
    selectedRespondent.et3HubLinksStatuses
  );
  return Array.from(Array(ET3TaskListSectionForRep.length)).map((__ignored, index) =>
    getSection(index, translations, et3HubLinksStatuses, languageParam)
  );
};
