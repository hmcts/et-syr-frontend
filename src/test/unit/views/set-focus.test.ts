import { expect } from 'chai';

import { focusToGovUKErrorDiv } from '../../../main/assets/js/set-focus';

describe('Error document title', () => {
  it('prefixes the current page title when the page has an error summary', () => {
    document.title = 'Check your answers - Contact details - Employment Tribunals - GOV.UK';
    document.body.innerHTML = '<div class="govuk-error-summary"></div>';

    focusToGovUKErrorDiv();

    expect(document.title).to.equal('Error: Check your answers - Contact details - Employment Tribunals - GOV.UK');
  });
});
