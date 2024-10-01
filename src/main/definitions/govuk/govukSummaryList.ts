import { InterceptPaths } from '../constants';

export function addSummaryRow(
  key: string,
  text: SummaryListContent['text'],
  actions?: SummaryListActions
): SummaryListRow {
  return {
    key: { text: key, classes: 'govuk-!-font-weight-regular-m' },
    value: { text },
    actions,
  };
}

export function addSummaryHtmlRow(
  key: string,
  text: SummaryListContent['html'],
  actions?: SummaryListActions
): SummaryListRow {
  return {
    key: { text: key, classes: 'govuk-!-font-weight-regular-m' },
    value: { html: text },
    actions,
  };
}

export function addSummaryRowWithAction(
  key: string,
  value: string | undefined,
  pageUrl: string | undefined,
  linkText?: string
): SummaryListRow {
  return {
    key: { text: key, classes: 'govuk-!-font-weight-regular-m' },
    value: { text: value || '' }, // Default to empty string if undefined
    actions:
      { items: [{ href: pageUrl + InterceptPaths.ANSWERS_CHANGE, text: linkText, visuallyHiddenText: key }] } ||
      undefined, // Skip actions if no pageUrl
  };
}

export function createChangeAction(href: string, text: string, visuallyHiddenText?: string): SummaryListActions {
  return { items: [{ href, text, visuallyHiddenText: visuallyHiddenText || text }] };
}

export interface SummaryListOptions {
  rows: SummaryListRow[];
  card?: SummaryListCard;
  classes?: string;
  attributes?: Record<string, string>;
}

export interface SummaryListRow {
  key: SummaryListContent;
  value?: SummaryListContent;
  actions?: SummaryListActions;
  classes?: string;
}

export interface SummaryListContent {
  text?: string | string[] | number;
  html?: string;
  classes?: string;
}

export interface SummaryListActions {
  items: SummaryListActionItem[];
  classes?: string;
}

export interface SummaryListActionItem {
  href: string;
  text?: string;
  html?: string;
  visuallyHiddenText?: string;
  classes?: string;
  attributes?: Record<string, string>;
}

export interface SummaryListCard {
  title: SummaryListCardTitle;
  actions: SummaryListCardActions;
  classes?: string;
  attributes?: Record<string, string>;
}

export interface SummaryListCardTitle {
  text?: string;
  html?: string;
  headingLevel?: number;
  classes?: string;
}

export interface SummaryListCardActions {
  items: SummaryListCardActionItem[];
  classes?: string;
}

export interface SummaryListCardActionItem {
  href: string;
  text?: string;
  html?: string;
}
