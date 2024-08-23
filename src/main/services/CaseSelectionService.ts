import { AxiosResponse } from 'axios';

import { CaseApiDataResponse } from '../definitions/api/caseApiResponse';
import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, Respondent, YesOrNo } from '../definitions/case';
import { ApplicationTableRecord, CaseState } from '../definitions/definition';
import { AnyRecord } from '../definitions/util-types';
import { formatApiCaseDataToCaseWithId } from '../helpers/ApiFormatter';
import { translateOverallStatus, translateTypesOfClaims } from '../helpers/ApplicationTableRecordTranslationHelper';
import { getLogger } from '../logger';

import { getCaseApi } from './CaseService';

const logger = getLogger('CaseSelectionService');

export const getRedirectUrl = (userCase: CaseWithId, languageParam: string): string => {
  if (userCase.state === CaseState.AWAITING_SUBMISSION_TO_HMCTS) {
    return `/claimant-application/${userCase.id}${languageParam}`;
  } else {
    return `/response-hub/${userCase.id}${languageParam}`;
  }
};

export const getUserCasesByLastModified = async (req: AppRequest): Promise<CaseWithId[]> => {
  try {
    const cases = await getCaseApi(req.session.user?.accessToken).getUserCases();
    if (cases.data.length === 0) {
      return [];
    } else {
      logger.info(`Retrieving cases for ${req.session.user?.id}`);
      const casesByLastModified: CaseApiDataResponse[] = sortCasesByLastModified(cases);
      return casesByLastModified.map(app => formatApiCaseDataToCaseWithId(app, req));
    }
  } catch (err) {
    logger.error(err.message);
    return [];
  }
};

export const sortCasesByLastModified = (cases: AxiosResponse<CaseApiDataResponse[]>): CaseApiDataResponse[] => {
  return cases.data.sort((a, b) => {
    const da = new Date(a.last_modified),
      db = new Date(b.last_modified);
    return db.valueOf() - da.valueOf();
  });
};

export const getUserApplications = (
  userCases: CaseWithId[],
  translations: AnyRecord,
  languageParam: string
): ApplicationTableRecord[] => {
  const apps: ApplicationTableRecord[] = [];

  for (const uCase of userCases) {
    const rec: ApplicationTableRecord = {
      userCase: uCase,
      respondents: formatRespondents(uCase.respondents),
      completionStatus: getOverallStatus(uCase, translations),
      url: getRedirectUrl(uCase, languageParam),
    };
    translateTypesOfClaims(rec, translations);
    apps.push(rec);
  }
  return apps;
};

export const formatRespondents = (respondents?: Respondent[]): string => {
  if (respondents === undefined) {
    return 'undefined';
  }
  return respondents.map(respondent => respondent.respondentName).join('<br />');
};

export const getOverallStatus = (userCase: CaseWithId, translations: AnyRecord): string => {
  const totalSections = 4;
  let sectionCount = 0;

  if (userCase?.personalDetailsCheck === YesOrNo.YES) {
    sectionCount++;
  }

  if (userCase?.employmentAndRespondentCheck === YesOrNo.YES) {
    sectionCount++;
  }

  if (userCase?.claimDetailsCheck === YesOrNo.YES) {
    sectionCount++;
  }

  const allSectionsCompleted = !!(
    userCase?.personalDetailsCheck === YesOrNo.YES &&
    userCase?.employmentAndRespondentCheck === YesOrNo.YES &&
    userCase?.claimDetailsCheck === YesOrNo.YES
  );

  if (allSectionsCompleted) {
    sectionCount++;
  }

  const overallStatus: AnyRecord = {
    sectionCount,
    totalSections,
  };

  return translateOverallStatus(overallStatus, translations);
};
