import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { languages } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const pageJson = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../../../main/resources/locales/en/translation/type-of-organisation.json'),
    'utf-8'
  )
);
const welshPageJson = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../../../main/resources/locales/cy/translation/type-of-organisation.json'),
    'utf-8'
  )
);

const PAGE_URL = '/type-of-organisation';
const radioClass = 'govuk-radios__item';

const renderPage = async (url: string): Promise<Document> => {
  const response = await request(mockApp({})).get(url);
  return new DOMParser().parseFromString(response.text, 'text/html');
};

const expectQuestionLegend = (htmlRes: Document, expectedQuestion: string): void => {
  const heading = htmlRes.getElementsByClassName('govuk-fieldset__heading');
  expect(heading.length).equal(1, 'Expected one question heading');
  expect(heading[0].textContent).contains(expectedQuestion);
  expect(heading[0].parentElement?.className).contains('govuk-fieldset__legend--l');
  const fieldset = heading[0].parentElement?.parentElement;
  expect(fieldset?.tagName).equal('FIELDSET');
  expect(fieldset?.getElementsByClassName(radioClass).length).equal(5);
  expect(fieldset?.textContent).contains(pageJson.limitedCompanyTextLabel);
  const duplicateHeadings = htmlRes.getElementsByClassName('govuk-heading-l');
  for (const duplicate of Array.from(duplicateHeadings)) {
    expect(duplicate.textContent).not.contains(expectedQuestion);
  }
};

describe('What type of organisation is the respondent page', () => {
  it('should show the question as the radio group legend', async () => {
    const htmlRes = await renderPage(PAGE_URL);
    expectQuestionLegend(htmlRes, pageJson.h1);
    const radios = htmlRes.getElementsByClassName(radioClass);
    expect(radios[0].textContent).contains(pageJson.individual);
    expect(radios[1].textContent).contains(pageJson.limitedCompany);
    expect(radios[4].textContent).contains(pageJson.other);
  });

  it('should show the Welsh question as the radio group legend', async () => {
    const htmlRes = await renderPage(PAGE_URL + languages.WELSH_URL_PARAMETER);
    const heading = htmlRes.getElementsByClassName('govuk-fieldset__heading');
    expect(heading.length).equal(1, 'Expected one question heading');
    expect(heading[0].textContent).contains(welshPageJson.h1);
  });
});
