export interface GovUKTaskListItem {
  title: {
    text: string;
  };
  hint?: {
    text: string;
  };
  href?: string;
  status: {
    text?: string;
    tag?: {
      text: string;
      classes: string;
    };
  };
}
