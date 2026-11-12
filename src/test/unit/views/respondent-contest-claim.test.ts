import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { languages } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

const pageJson = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../../../main/resources/locales/en/translation/respondent-contest-claim.json'),
    'utf-8'
  )
);
const welshPageJson = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../../../main/resources/locales/cy/translation/respondent-contest-claim.json'),
    'utf-8'
  )
);

const PAGE_URL = '/respondent-contest-claim';
const respondentName = 'Mrs Test Auto';
const radioClass = 'govuk-radios__item';

const question = (copy: { h1: string; h1Extra: string }): string => `${copy.h1}${respondentName}${copy.h1Extra}`;

const renderPage = async (url: string): Promise<Document> => {
  const response = await request(mockApp({ userCase: { respondentName } })).get(url);
  return new DOMParser().parseFromString(response.text, 'text/html');
};

const expectQuestionLegend = (htmlRes: Document, expectedQuestion: string, optionCount: number): void => {
  const heading = htmlRes.getElementsByClassName('govuk-fieldset__heading');
  expect(heading.length).equal(1, 'Expected one question heading');
  expect(heading[0].textContent).contains(expectedQuestion);
  expect(heading[0].parentElement?.className).contains('govuk-fieldset__legend--l');
  const fieldset = heading[0].parentElement?.parentElement;
  expect(fieldset?.tagName).equal('FIELDSET');
  expect(fieldset?.getElementsByClassName(radioClass).length).equal(optionCount);
  const duplicateHeadings = htmlRes.getElementsByClassName('govuk-heading-l');
  for (const duplicate of Array.from(duplicateHeadings)) {
    expect(duplicate.textContent).not.contains(expectedQuestion);
  }
};

describe('Does the respondent contest the claim page', () => {
  it('should show the question, including the respondent name, as the radio group legend', async () => {
    const htmlRes = await renderPage(PAGE_URL);
    expectQuestionLegend(htmlRes, question(pageJson), 2);
    const radios = htmlRes.getElementsByClassName(radioClass);
    expect(radios[0].textContent).contains(pageJson.yes1);
    expect(radios[0].textContent).contains(respondentName);
    expect(radios[1].textContent).contains(pageJson.no1);
    expect(radios[1].textContent).contains(respondentName);
  });

  it('should show the Welsh question as the radio group legend', async () => {
    const htmlRes = await renderPage(PAGE_URL + languages.WELSH_URL_PARAMETER);
    const expectedQuestion = question(welshPageJson);
    expect(htmlRes.getElementsByClassName('govuk-fieldset__heading')[0].textContent).contains(expectedQuestion);
    expectQuestionLegend(htmlRes, expectedQuestion, 2);
  });
});
