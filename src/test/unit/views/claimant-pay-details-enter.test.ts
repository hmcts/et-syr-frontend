import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { mockApp } from '../mocks/mockApp';

const commonJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/common.json'),
  'utf-8'
);
const pageJsonRaw = fs.readFileSync(
  path.resolve(__dirname, '../../../main/resources/locales/en/translation/claimant-pay-details-enter.json'),
  'utf-8'
);
const commonJson = JSON.parse(commonJsonRaw);
const pageJson = JSON.parse(pageJsonRaw);

const PAGE_URL = '/claimant-pay-details-enter';
const titleClass = 'govuk-heading-l';
const expectedTitle = pageJson.title;
const radioClass = 'govuk-radios__item';
const expectedRadioLabel1 = commonJson.weekly;
const expectedRadioLabel2 = commonJson.monthly;
const expectedRadioLabel3 = commonJson.annually;
const expectedRadioLabel4 = commonJson.notSure;
const buttonClass = 'govuk-button';

let htmlRes: Document;
describe('Acas early conciliation certificate page', () => {
  beforeAll(async () => {
    await request(mockApp({}))
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
  });

  it('should display 4 input fields', () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons.length).equal(4, `only ${radioButtons.length} found`);
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
    expect(radioButtons[2].innerHTML).contains(
      expectedRadioLabel3,
      'Could not find the radio button with label ' + expectedRadioLabel3
    );
    expect(radioButtons[3].innerHTML).contains(
      expectedRadioLabel4,
      'Could not find the radio button with label ' + expectedRadioLabel4
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
