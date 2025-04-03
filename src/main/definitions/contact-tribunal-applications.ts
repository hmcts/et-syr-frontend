export enum ApplicationType {
  A = 'A',
  B = 'B',
  C = 'C',
}

export interface Application {
  code?: string; // SYR and Respondent Legal Rep version
  claimant: string; // Claimant version
  claimantLegalRep: string; // Claimant Legal Rep version
  url?: string;
  type: ApplicationType;
  isRespondentApp: boolean;
}

export const application: { [key: string]: Application } = {
  CHANGE_PERSONAL_DETAILS: {
    code: 'Change personal details',
    claimant: 'Change my personal details',
    claimantLegalRep: 'Change personal details',
    url: 'change-my-personal-details',
    type: ApplicationType.B,
    isRespondentApp: true,
  },
  POSTPONE_HEARING: {
    code: 'Postpone a hearing',
    claimant: 'Postpone a hearing',
    claimantLegalRep: 'Postpone a hearing',
    url: 'apply-to-postpone-my-hearing',
    type: ApplicationType.A,
    isRespondentApp: true,
  },
  VARY_OR_REVOKE_ORDER: {
    code: 'Vary or revoke an order',
    claimant: 'Vary/revoke an order',
    claimantLegalRep: 'Vary or revoke an order',
    url: 'apply-to-vary-or-revoke-an-order',
    type: ApplicationType.A,
    isRespondentApp: true,
  },
  CONSIDER_DECISION_AFRESH: {
    code: 'Consider a decision afresh',
    claimant: 'Consider a decision afresh',
    claimantLegalRep: 'Consider decision afresh',
    url: 'apply-to-have-a-decision-considered-afresh',
    type: ApplicationType.B,
    isRespondentApp: true,
  },
  AMEND_RESPONSE: {
    code: 'Amend response',
    claimant: 'Amend my claim',
    claimantLegalRep: 'Amend claim',
    url: 'apply-to-amend-my-response',
    type: ApplicationType.A,
    isRespondentApp: true,
  },
  ORDER_OTHER_PARTY: {
    code: 'Order other party',
    claimant: 'Order respondent to do something',
    claimantLegalRep: 'Order other party',
    url: 'order-the-applicant-to-do-something',
    type: ApplicationType.A,
    isRespondentApp: true,
  },
  ORDER_WITNESS_ATTEND: {
    code: 'Order a witness to attend to give evidence',
    claimant: 'Order a witness to attend',
    claimantLegalRep: 'Order a witness to attend to give evidence',
    url: 'order-a-witness-to-give-evidence',
    type: ApplicationType.C,
    isRespondentApp: true,
  },
  CLAIMANT_NOT_COMPLIED: {
    code: 'Claimant not complied',
    claimant: 'Tell tribunal respondent not complied',
    claimantLegalRep: 'Respondent not complied',
    url: 'notify-tribunal-applicant-has-not-complied-with-an-order',
    type: ApplicationType.A,
    isRespondentApp: true,
  },
  RESTRICT_PUBLICITY: {
    code: 'Restrict publicity',
    claimant: 'Restrict publicity',
    claimantLegalRep: 'Restrict publicity',
    url: 'apply-to-restrict-publicity',
    type: ApplicationType.A,
    isRespondentApp: true,
  },
  STRIKE_OUT_CLAIM: {
    code: 'Strike out all or part of a claim',
    claimant: 'Strike out all/part of response',
    claimantLegalRep: 'Strike out all or part of the response',
    url: 'strike-out-all-or-part-of-application',
    type: ApplicationType.A,
    isRespondentApp: true,
  },
  RECONSIDER_JUDGMENT: {
    code: 'Reconsider judgement',
    claimant: 'Reconsider judgement',
    claimantLegalRep: 'Reconsider judgment',
    url: 'apply-for-judgment-to-be-reconsidered',
    type: ApplicationType.B,
    isRespondentApp: true,
  },
  CONTACT_TRIBUNAL: {
    code: 'Contact the tribunal',
    claimant: 'Contact about something else',
    claimantLegalRep: 'Contact the tribunal',
    url: 'contact-tribunal',
    type: ApplicationType.A,
    isRespondentApp: true,
  },
  WITHDRAWAL_OF_ALL_OR_PART_CLAIM: {
    claimant: 'Withdraw all/part of claim',
    claimantLegalRep: 'Withdraw all or part of claim',
    type: ApplicationType.B,
    isRespondentApp: false,
  },
};
