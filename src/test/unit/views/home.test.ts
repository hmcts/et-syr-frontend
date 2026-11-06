import { expect } from 'chai';
import express, { Express } from 'express';
import request from 'supertest';

import { AppRequest } from '../../../main/definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { I18Next } from '../../../main/modules/i18next';
import { Nunjucks } from '../../../main/modules/nunjucks';

const homeApp: Express = express();
homeApp.locals.developmentMode = false;
new Nunjucks(false).enableFor(homeApp);
new I18Next().enableFor(homeApp);

homeApp.get(PageUrls.HOME, (req: AppRequest, res) => {
  res.render(TranslationKeys.HOME, {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.HOME, { returnObjects: true }),
    PageUrls,
    redirectUrl: PageUrls.CASE_NUMBER_CHECK,
    languageParam: req.query.lng === 'cy' ? '?lng=cy' : '?lng=en',
  });
});

const renderHome = async (language: 'en' | 'cy'): Promise<Document> => {
  const response = await request(homeApp).get(PageUrls.HOME).query({ lng: language });
  return new DOMParser().parseFromString(response.text, 'text/html');
};

const otherRelevantLinks = (document: Document): HTMLAnchorElement[] => {
  const heading = Array.from(document.querySelectorAll('h2')).find(element =>
    ['Other Relevant Links', 'Dolenni perthnasol eraill'].includes(element.textContent.trim())
  );
  return Array.from(heading.parentElement.querySelectorAll('a'));
};

describe('Introduction page other relevant links', () => {
  it('warns that each English link opens in a new tab', async () => {
    const links = otherRelevantLinks(await renderHome('en'));

    expect(links.map(link => link.textContent.trim())).to.deep.equal([
      'How to make a claim (opens in new tab)',
      'How to make a response (opens in new tab)',
      'More from the Working, jobs and pensions category (opens in new tab)',
    ]);
    links.forEach(link => {
      expect(link.getAttribute('target')).to.equal('_blank');
      expect(link.getAttribute('rel')).to.equal('noreferrer noopener');
    });
    expect(links.map(link => link.getAttribute('href'))).to.deep.equal([
      'https://www.gov.uk/employment-tribunals',
      'https://www.gov.uk/being-taken-to-employment-tribunal-by-employee',
      'http://gov.uk/browse/working',
    ]);
  });

  it('warns that each Welsh link opens in a new tab', async () => {
    const links = otherRelevantLinks(await renderHome('cy'));

    expect(links.map(link => link.textContent.trim())).to.deep.equal([
      'Sut i wneud hawliad (yn agor mewn tab newydd)',
      'Sut i ymateb (yn agor mewn tab newydd)',
      "Mwy o'r categori gweithio, swyddi a phensiynau (yn agor mewn tab newydd)",
    ]);
  });
});
