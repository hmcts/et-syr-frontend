import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import express, { Express } from 'express';
import request from 'supertest';

import { AppRequest } from '../../../main/definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { I18Next } from '../../../main/modules/i18next';
import { Nunjucks } from '../../../main/modules/nunjucks';

const readTranslation = (language: string, name: string): Record<string, string> => {
  return JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, `../../../main/resources/locales/${language}/translation/${name}.json`),
      'utf-8'
    )
  );
};

const enCaseDetails = readTranslation('en', 'case-details');
const cyCaseDetails = readTranslation('cy', 'case-details');
const enTemplate = readTranslation('en', 'template');
const cyTemplate = readTranslation('cy', 'template');
const enCommon = readTranslation('en', 'common');
const cyCommon = readTranslation('cy', 'common');

const claimant = { firstName: 'Jane', lastName: 'Smith', ethosCaseReference: '6000012/2024' };

const caseOverviewApp: Express = express();
caseOverviewApp.locals.developmentMode = false;
new Nunjucks(false).enableFor(caseOverviewApp);
new I18Next().enableFor(caseOverviewApp);

caseOverviewApp.get('/case-overview', (req: AppRequest, res) => {
  const welsh = req.query.lng === 'cy';
  const caseDetails = welsh ? cyCaseDetails : enCaseDetails;
  res.render(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER, {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.CASE_DETAILS_STATUS, { returnObjects: true }),
    ...req.t(TranslationKeys.CASE_DETAILS_WITH_CASE_ID_PARAMETER, { returnObjects: true }),
    ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
    PageUrls,
    hideContactUs: true,
    userCase: claimant,
    respondentName: 'Acme Ltd',
    progressBarItems: [],
    sections: [
      {
        title: caseDetails.section1,
        links: [
          {
            shouldShow: false,
            linkTxt: caseDetails.personalDetails,
            status: 'Not started yet',
            statusColor: '--grey',
            url: '#',
          },
        ],
      },
    ],
    languageParam: welsh ? '?lng=cy' : '?lng=en',
    respondentRepresented: false,
  });
});

const collapseWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

const renderCaseOverview = async (language: 'en' | 'cy'): Promise<Document> => {
  const response = await request(caseOverviewApp).get('/case-overview').query({ lng: language });
  return new DOMParser().parseFromString(response.text, 'text/html');
};

const headingText = (language: 'en' | 'cy', respondentLabel: string): string => {
  const copy = language === 'cy' ? cyCaseDetails : enCaseDetails;
  return collapseWhitespace(`${copy.header}${claimant.firstName} ${claimant.lastName} vs ${respondentLabel}`);
};

describe('Case overview page', () => {
  it('renders one h1 for the case overview heading when the respondent has a name', async () => {
    const htmlRes = await renderCaseOverview('en');
    const headings = htmlRes.querySelectorAll('h1');
    const mainHeadings = htmlRes.querySelectorAll('main h1, main h2');

    expect(headings.length).equal(1, 'page should have one h1');
    expect(headings[0].classList.contains('govuk-heading-l')).equal(true);
    expect(collapseWhitespace(headings[0].textContent)).equal(headingText('en', 'Acme Ltd'));
    expect(mainHeadings[0].tagName).equal('H1');
    expect(htmlRes.title).equal(`${enCaseDetails.title} - ${enTemplate.serviceName} - ${enCommon.govUk}`);
  });

  it('keeps the task list and sidebar headings as h2', async () => {
    const htmlRes = await renderCaseOverview('en');
    const sectionHeading = htmlRes.querySelector('main h2.govuk-heading-m');
    const sidebarHeading = htmlRes.querySelector('h2.govuk-heading-s');

    expect(sectionHeading.textContent).contains(enCaseDetails.section1);
    expect(sidebarHeading.textContent).contains(enCaseDetails.iWantTo);
  });

  it('renders the Welsh case overview heading as the only h1', async () => {
    const htmlRes = await renderCaseOverview('cy');
    const headings = htmlRes.querySelectorAll('h1');

    expect(headings.length).equal(1, 'page should have one h1');
    expect(collapseWhitespace(headings[0].textContent)).equal(headingText('cy', 'Acme Ltd'));
    expect(htmlRes.title).equal(`${cyCaseDetails.title} - ${cyTemplate.serviceName} - ${cyCommon.govUk}`);
  });
});
