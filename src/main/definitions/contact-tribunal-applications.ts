export enum ApplicationType {
  A = 'A',
  B = 'B',
  C = 'C',
}

export interface Application {
  code?: string; // ListElementCode in config
  claimant: string; // Claimant version
  url?: string;
  type: ApplicationType;
}

export const application: { [key: string]: Application } = {
  CHANGE_PERSONAL_DETAILS: {
    code: 'Change personal details',
    claimant: 'Change my personal details',
    url: 'change-my-personal-details',
    type: ApplicationType.B,
  },
  POSTPONE_HEARING: {
    code: 'Postpone a hearing',
    claimant: 'Postpone a hearing',
    url: 'apply-to-postpone-my-hearing',
    type: ApplicationType.A,
  },
  VARY_OR_REVOKE_ORDER: {
    code: 'Vary or revoke an order',
    claimant: 'Vary/revoke an order',
    url: 'apply-to-vary-or-revoke-an-order',
    type: ApplicationType.A,
  },
  CONSIDER_DECISION_AFRESH: {
    code: 'Consider a decision afresh',
    claimant: 'Consider a decision afresh',
    url: 'apply-to-have-a-decision-considered-afresh',
    type: ApplicationType.B,
  },
  AMEND_RESPONSE: {
    code: 'Amend response',
    claimant: 'Amend my claim',
    url: 'apply-to-amend-my-response',
    type: ApplicationType.A,
  },
  ORDER_OTHER_PARTY: {
    code: 'Order other party',
    claimant: 'Order respondent to do something',
    url: 'order-the-applicant-to-do-something',
    type: ApplicationType.A,
  },
  ORDER_WITNESS_ATTEND: {
    code: 'Order a witness to attend to give evidence',
    claimant: 'Order a witness to attend',
    url: 'order-a-witness-to-give-evidence',
    type: ApplicationType.C,
  },
  CLAIMANT_NOT_COMPLIED: {
    code: 'Claimant not complied',
    claimant: 'Tell tribunal respondent not complied',
    url: 'notify-tribunal-applicant-has-not-complied-with-an-order',
    type: ApplicationType.A,
  },
  RESTRICT_PUBLICITY: {
    code: 'Restrict publicity',
    claimant: 'Restrict publicity',
    url: 'apply-to-restrict-publicity',
    type: ApplicationType.A,
  },
  STRIKE_OUT_CLAIM: {
    code: 'Strike out all or part of a claim',
    claimant: 'Strike out all/part of response',
    url: 'strike-out-all-or-part-of-application',
    type: ApplicationType.A,
  },
  RECONSIDER_JUDGMENT: {
    code: 'Reconsider judgement',
    claimant: 'Reconsider judgement',
    url: 'apply-for-judgment-to-be-reconsidered',
    type: ApplicationType.B,
  },
  CONTACT_TRIBUNAL: {
    code: 'Contact the tribunal',
    claimant: 'Contact about something else',
    url: 'contact-tribunal',
    type: ApplicationType.A,
  },
  WITHDRAWAL_OF_ALL_OR_PART_CLAIM: {
    claimant: 'Withdraw all/part of claim',
    type: ApplicationType.B,
  },
};
