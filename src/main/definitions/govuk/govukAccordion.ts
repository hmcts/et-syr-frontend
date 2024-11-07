export interface AccordionItem {
  heading: {
    text: string;
  };
  summary?: {
    text: string;
  };
  content: {
    html: string;
  };
}

export function addAccordionRow(headingText: string, contentHtml: string): AccordionItem {
  return {
    heading: {
      text: headingText,
    },
    content: {
      html: contentHtml,
    },
  };
}
