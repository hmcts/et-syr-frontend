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
    path.resolve(__dirname, '../../../main/resources/locales/en/translation/claimant-employment-dates-enter.json'),
    'utf-8'
  )
);

const PAGE_URL = '/claimant-employment-dates-enter';
const sectionTitleClass = 'govuk-caption-l';
const expectedSectionTitle = commonJson.sectionTitle.s2;
const titleClass = 'govuk-heading-l';
const expectedTitle = pageJson.title;
const dateInputClass = 'govuk-date-input__item';
const expectedInputLabel1 = 'Day';
const expectedInputLabel2 = 'Month';
const expectedInputLabel3 = 'Year';
const textAreaClass = 'govuk-textarea';
const buttonClass = 'govuk-button';

let htmlRes: Document;
describe('Claimant employment dates enter page', () => {
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

  it('should display 6 input fields', () => {
    const dateInputs = htmlRes.getElementsByClassName(dateInputClass);
    expect(dateInputs.length).equal(6, `only ${dateInputs.length} found`);
  });

  it('should display inputs with valid labels', () => {
    const dateInputs = htmlRes.getElementsByClassName(dateInputClass);
    expect(dateInputs[0].innerHTML).contains(
      expectedInputLabel1,
      'Could not find the radio button with label ' + expectedInputLabel1
    );
    expect(dateInputs[1].innerHTML).contains(
      expectedInputLabel2,
      'Could not find the radio button with label ' + expectedInputLabel2
    );
    expect(dateInputs[2].innerHTML).contains(
      expectedInputLabel3,
      'Could not find the radio button with label ' + expectedInputLabel3
    );
    expect(dateInputs[3].innerHTML).contains(
      expectedInputLabel1,
      'Could not find the radio button with label ' + expectedInputLabel1
    );
    expect(dateInputs[4].innerHTML).contains(
      expectedInputLabel2,
      'Could not find the radio button with label ' + expectedInputLabel2
    );
    expect(dateInputs[5].innerHTML).contains(
      expectedInputLabel3,
      'Could not find the radio button with label ' + expectedInputLabel3
    );
  });

  it('should have 1 text area field', () => {
    const textAreaField = htmlRes.getElementsByClassName(textAreaClass);
    expect(textAreaField.length).equal(1, `only ${textAreaField.length} found`);
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
