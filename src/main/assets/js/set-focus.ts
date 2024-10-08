// Autofocus section
// Code below automatically focuses to errors, in case any error exists on the page for accessibility

import { PageUrls } from '../../definitions/constants';

if (document.addEventListener) {
  document.addEventListener('load', focusToGovUKErrorDiv);
  document.addEventListener('pageshow', focusToGovUKErrorDiv);
  document.addEventListener('DOMContentLoaded', focusToGovUKErrorDiv);
}

export const findFirstElementByClassName = (className: string): HTMLElement => {
  const elementsByClassName = Array.from(document.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>);
  if (elementsByClassName !== null && elementsByClassName !== undefined && elementsByClassName.length > 0) {
    return elementsByClassName[0];
  }
  return null;
};

export function focusToGovUKErrorDiv(): void {
  if (window.location.href.indexOf('#') > 0) {
    if (
      !window.location.href.includes('address-details') &&
      !window.location.href.includes('respondent-address') &&
      !window.location.href.includes('place-of-work')
    ) {
      const baseUrl = window.location.href.substring(0, window.location.href.indexOf('#'));
      const respondentIndex = baseUrl.indexOf('/respondent/');
      if (respondentIndex === -1) {
        const ValidRedirects = Object.values(PageUrls);
        for (const url of ValidRedirects) {
          const path = baseUrl.substring(baseUrl.lastIndexOf('/'));
          if (path === url) {
            window.open(url, '_self');
            break;
          }
        }
      } else {
        const ValidRespondentRedirects = Object.values([]);
        for (const url of ValidRespondentRedirects) {
          const respondentPath = baseUrl.substring(respondentIndex);
          if (respondentPath === url) {
            window.open(url, '_self');
            break;
          }
        }
      }
    }
  }
  const govUKErrorDiv = findFirstElementByClassName('govuk-error-summary');
  if (govUKErrorDiv !== null && govUKErrorDiv !== undefined) {
    if (!govUKErrorDiv.classList.contains('hidden')) {
      if (!document.title.includes('Error')) {
        document.title = 'Error: ' + document.title;
      }
      govUKErrorDiv.focus();
      govUKErrorDiv.setAttribute('tabindex', '-1');
    }
  }
}

focusToGovUKErrorDiv();
