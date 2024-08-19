import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { sectionStatus } from '../definitions/definition';
import { AnyRecord } from '../definitions/util-types';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class RespondentResponseTaskListController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const redirectUrl = setUrlLanguage(req, '#');

    const sections = [
      {
        title: (l: AnyRecord): string => l.section1.title,
        links: [
          {
            url: setUrlLanguage(req, '#'),
            linkTxt: (l: AnyRecord): string => l.section1.link1Text,
            status: (): string => sectionStatus.notStarted,
          },
          {
            url: setUrlLanguage(req, '#'),
            linkTxt: (l: AnyRecord): string => l.section1.link2Text,
            status: (): string => sectionStatus.notStarted,
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section2.title,
        links: [
          {
            url: setUrlLanguage(req, '#'),
            linkTxt: (l: AnyRecord): string => l.section2.link1Text,
            status: (): string => sectionStatus.notStarted,
          },
          {
            url: setUrlLanguage(req, '#'),
            linkTxt: (l: AnyRecord): string => l.section2.link2Text,
            status: (): string => sectionStatus.notStarted,
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section3.title,
        links: [
          {
            url: setUrlLanguage(req, '#'),
            linkTxt: (l: AnyRecord): string => l.section3.link1Text,
            status: (): string => sectionStatus.notStarted,
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section4.title,
        links: [
          {
            url: (): string => '',
            linkTxt: (l: AnyRecord): string => l.section4.link1Text,
            status: (): string => sectionStatus.cannotStartYet,
          },
        ],
      },
    ];

    res.render(TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST, {
      ...req.t(TranslationKeys.COMMON as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST as never, { returnObjects: true } as never),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US as never, { returnObjects: true } as never),
      PageUrls,
      hideContactUs: true,
      sections,
      redirectUrl,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
    });
  }
}