import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { AnyRecord } from '../../../main/definitions/util-types';
import { mockApp } from '../mocks/mockApp';

const respondentName = 'Mrs Test Auto';

const readTranslation = (locale: 'en' | 'cy', file: string): AnyRecord => {
  return JSON.parse(
    fs.readFileSync(path.resolve(__dirname, `../../../main/resources/locales/${locale}/translation/${file}`), 'utf-8')
  );
};

const fullTitle = (locale: 'en' | 'cy', pageTitle: string): string => {
  const template = readTranslation(locale, 'template.json');
  const common = readTranslation(locale, 'common.json');
  return `${pageTitle} - ${template.serviceName} - ${common.govUk}`;
};

const expectedPages = (locale: 'en' | 'cy'): { url: string; title: string; heading?: string }[] => {
  const common = readTranslation(locale, 'common.json');
  const contactDetails = readTranslation(locale, 'check-your-answers-contact-details.json');
  const hearing = readTranslation(locale, 'check-your-answers-hearing-preferences.json');
  const earlyConciliation = readTranslation(locale, 'check-your-answers-early-conciliation-and-employee-details.json');
  const pay = readTranslation(locale, 'check-your-answers-pay-pension-and-benefits.json');
  const contestSection = readTranslation(locale, 'check-your-answers-contest-claim.json');
  const employersSection = readTranslation(locale, 'check-your-answers-employers-contract-claim.json');
  const contest = readTranslation(locale, 'respondent-contest-claim.json');
  const contestReason = readTranslation(locale, 'respondent-contest-claim-reason.json');
  const employersClaim = readTranslation(locale, 'employers-contract-claim.json');
  const employersClaimDetails = readTranslation(locale, 'employers-contract-claim-details.json');
  const contactTribunal = readTranslation(locale, 'contact-tribunal-check-your-answers.json');
  const contactTribunalJourney = readTranslation(locale, 'contact-tribunal-contact-tribunal.json');
  const applications = readTranslation(locale, 'claimants-applications.json');
  const respondToApplication = readTranslation(locale, 'respond-to-application-check-your-answers.json');
  const notification = readTranslation(locale, 'respond-to-notification-check-your-answers.json');
  const bundles = readTranslation(locale, 'bundles-docs-for-hearing-cya.json');
  const hearingDocuments = readTranslation(locale, 'about-hearing-documents.json');

  return [
    {
      url: PageUrls.CHECK_YOUR_ANSWERS_CONTACT_DETAILS,
      title: fullTitle(locale, `${common.cya.title} - ${contactDetails.header}`),
      heading: common.cya.title,
    },
    {
      url: PageUrls.CHECK_YOUR_ANSWERS_HEARING_PREFERENCES,
      title: fullTitle(locale, `${common.cya.title} - ${hearing.header}`),
    },
    {
      url: PageUrls.CHECK_YOUR_ANSWERS_EARLY_CONCILIATION_AND_EMPLOYEE_DETAILS,
      title: fullTitle(locale, `${common.cya.title} - ${earlyConciliation.header}`),
    },
    {
      url: PageUrls.CHECK_YOUR_ANSWERS_PAY_PENSION_AND_BENEFITS,
      title: fullTitle(locale, `${common.cya.title} - ${pay.header}`),
    },
    {
      url: PageUrls.CHECK_YOUR_ANSWERS_CONTEST_CLAIM,
      title: fullTitle(locale, `${common.cya.title} - ${contestSection.header}`),
    },
    {
      url: PageUrls.CHECK_YOUR_ANSWERS_EMPLOYERS_CONTRACT_CLAIM,
      title: fullTitle(locale, `${common.cya.title} - ${employersSection.header}`),
    },
    {
      url: PageUrls.RESPONDENT_CONTEST_CLAIM,
      title: fullTitle(locale, `${contest.h1}${respondentName}${contest.h1Extra}`),
      heading: `${contest.h1}${respondentName}${contest.h1Extra}`,
    },
    {
      url: PageUrls.RESPONDENT_CONTEST_CLAIM_REASON,
      title: fullTitle(locale, contestReason.h1),
      heading: contestReason.h1,
    },
    {
      url: PageUrls.EMPLOYERS_CONTRACT_CLAIM,
      title: fullTitle(locale, employersClaim.title),
    },
    {
      url: PageUrls.EMPLOYERS_CONTRACT_CLAIM_DETAILS,
      title: fullTitle(locale, employersClaimDetails.title),
      heading: employersClaimDetails.title,
    },
    {
      url: PageUrls.CONTACT_TRIBUNAL_CYA,
      title: fullTitle(locale, `${contactTribunal.title} - ${contactTribunalJourney.title}`),
      heading: contactTribunal.title,
    },
    {
      url: PageUrls.CONTACT_TRIBUNAL_CYA_OFFLINE,
      title: fullTitle(locale, `${contactTribunal.title} - ${contactTribunal.storeBtn}`),
    },
    {
      url: PageUrls.RESPOND_TO_APPLICATION_CYA,
      title: fullTitle(locale, `${respondToApplication.title} - ${applications.title}`),
    },
    {
      url: PageUrls.RESPOND_TO_NOTIFICATION_CYA,
      title: fullTitle(locale, `${notification.h1} - ${notification.title}`),
      heading: notification.h1,
    },
    {
      url: PageUrls.RESPOND_TO_NOTIFICATION_CYA_OFFLINE,
      title: fullTitle(locale, `${notification.h1} - ${notification.storeButton}`),
    },
    {
      url: PageUrls.BUNDLES_DOCS_FOR_HEARING_CYA,
      title: fullTitle(locale, `${bundles.titleCya} - ${hearingDocuments.headingCaption}`),
      heading: bundles.titleCya,
    },
  ];
};

describe('Unique document titles', () => {
  const app = mockApp({
    userCase: {
      respondentName,
      respondents: [{ respondentName } as CaseWithId['respondents'][number]],
      contactApplicationType: 'Change personal details',
      copyToOtherPartyYesOrNo: YesOrNo.YES,
      selectedGenericTseApplication: { id: 'app-1', value: {} } as CaseWithId['selectedGenericTseApplication'],
      selectedNotification: { id: 'notification-1' } as CaseWithId['selectedNotification'],
    },
    session: { selectedRespondentIndex: 0 } as never,
  });

  it.each(['en', 'cy'] as const)('gives each page its own %s title', async locale => {
    const pages = expectedPages(locale);
    const titles: string[] = [];

    for (const page of pages) {
      const response = await request(app).get(`${page.url}?lng=${locale}`);
      expect(response.status).to.equal(200, `${page.url} (${locale}) did not render`);
      const document = new DOMParser().parseFromString(response.text, 'text/html');
      expect(document.title).to.equal(page.title, page.url);
      if (page.heading) {
        expect(document.getElementsByClassName('govuk-heading-l')[0].textContent.trim()).to.equal(page.heading);
      }
      titles.push(document.title);
    }

    expect(new Set(titles).size).to.equal(titles.length);
  });
});
