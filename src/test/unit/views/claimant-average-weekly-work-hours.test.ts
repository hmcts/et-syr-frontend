import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const commonJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../../main/resources/locales/en/translation/common.json'), 'utf-8')
);
const pageJson = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../../../main/resources/locales/en/translation/claimant-average-weekly-work-hours.json'),
    'utf-8'
  )
);

const PAGE_URL = '/claimant-average-weekly-work-hours';
const sectionTitleClass = 'govuk-caption-l';
const expectedSectionTitle = commonJson.sectionTitle.s2;
const titleClass = 'govuk-heading-l';
const expectedTitle = pageJson.title;
const pClass = 'govuk-body';
const expectedP1 = pageJson.p1;
const radioClass = 'govuk-radios__item';
const expectedRadioLabel1 = commonJson.yes;
const expectedRadioLabel2 = commonJson.no;
const expectedRadioLabel3 = commonJson.notSure;
const buttonClass = 'govuk-button';

let htmlRes: Document;
describe('Claimant average weekly work hours page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display section title', () => {
    const sectionTitle = htmlRes.getElementsByClassName(sectionTitleClass);
    expect(sectionTitle[0].innerHTML).contains(expectedSectionTitle, 'Page title does not exist');
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display paragraphs', () => {
    const p = htmlRes.getElementsByClassName(pClass);
    expect(p[6].innerHTML).contains(expectedP1, 'Paragraph does not exist');
  });

  it('should display 3 input fields', () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons.length).equal(3, `only ${radioButtons.length} found`);
  });

  it('should display inputs with valid labels', () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons[0].innerHTML).contains(
      expectedRadioLabel1,
      'Could not find the radio button with label ' + expectedRadioLabel1
    );
    expect(radioButtons[1].innerHTML).contains(
      expectedRadioLabel2,
      'Could not find the radio button with label ' + expectedRadioLabel2
    );
    expect(radioButtons[1].innerHTML).contains(
      expectedRadioLabel2,
      'Could not find the radio button with label ' + expectedRadioLabel3
    );
  });

  it('should display save and continue button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[5].innerHTML).contains('Save and continue', 'Could not find the button');
  });

  it('should display Save as draft button', () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[6].innerHTML).contains('Save as draft', 'Could not find the button');
  });
});
