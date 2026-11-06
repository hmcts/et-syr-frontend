import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

describe('Lip or representative page', () => {
  let htmlRes: Document;

  const pageUrl = '/lip-or-representative';

  const signOutLinkSelector = 'li.govuk-service-navigation__item a.govuk-service-navigation__link';
  const titleClass = 'govuk-heading-l';
  const pClass = 'govuk-body';
  const detailsSummaryClass = 'govuk-details__summary-text';
  const radioClass = 'govuk-radios__item';

  const missingTitleMessage = 'Page title does not exist';
  const missingParagraphMessage = 'Could not find the paragraph ';
  const missingDetailsMessage = 'Could not find the details ';
  const missingRadioMessage = 'Could not find the radio button with label ';

  const LipOrRepJson = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, '../../../main/resources/locales/en/translation/lip-or-representative.json'),
      'utf-8'
    )
  );
  const expectedTitle = LipOrRepJson.title;
  const expectedP1 = LipOrRepJson.p1;
  const expectedDetails1 = LipOrRepJson.detailsSummary1;
  const expectedDetails2 = LipOrRepJson.detailsSummary2;
  const expectedRadioLabel1 = LipOrRepJson.radio1;
  const expectedRadioLabel2 = LipOrRepJson.radio2;
  const expectedRadioLabel3 = LipOrRepJson.radio3;

  beforeAll(async () => {
    await request(app)
      .get(pageUrl)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should not display a sign out link as the user is not logged in', () => {
    const signoutLinks = htmlRes.querySelectorAll(signOutLinkSelector);
    expect(signoutLinks.length).equals(0, 'Sign out link should not exist');
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).contains(expectedTitle, missingTitleMessage);
  });

  it('should display text description', () => {
    const p1 = htmlRes.getElementsByClassName(pClass);
    expect(p1[6].innerHTML).contains(expectedP1, missingParagraphMessage + expectedP1);
  });

  it('should display details', () => {
    const detailsSummary = htmlRes.getElementsByClassName(detailsSummaryClass);
    expect(detailsSummary.length).equal(3, `only ${detailsSummary.length} found`);
    expect(detailsSummary[0].innerHTML).contains(expectedDetails1, missingDetailsMessage + expectedDetails1);
    expect(detailsSummary[1].innerHTML).contains(expectedDetails2, missingDetailsMessage + expectedDetails2);
  });

  it('should display inputs with valid labels', () => {
    const radioButtons = htmlRes.getElementsByClassName(radioClass);
    expect(radioButtons.length).equal(3, `only ${radioButtons.length} found`);
    expect(radioButtons[0].innerHTML).contains(expectedRadioLabel1, missingRadioMessage + expectedRadioLabel1);
    expect(radioButtons[1].innerHTML).contains(expectedRadioLabel2, missingRadioMessage + expectedRadioLabel2);
    expect(radioButtons[2].innerHTML).contains(expectedRadioLabel3, missingRadioMessage + expectedRadioLabel3);
  });
});
