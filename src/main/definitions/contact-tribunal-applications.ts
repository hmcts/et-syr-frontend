export enum ApplicationType {
  A = 'A',
  B = 'B',
  C = 'C',
}

export interface Application {
  code: string; // ListElementCode in config
  url: string;
  type: ApplicationType;
}

export const application: { [key: string]: Application } = {
  WITHDRAW_CLAIM: {
    code: 'Withdraw all or part of claim',
    url: 'withdraw-all-or-part-of-my-claim',
    type: ApplicationType.A,
  },
  CHANGE_PERSONAL_DETAILS: {
    code: 'Change personal details',
    url: 'change-my-personal-details',
    type: ApplicationType.B,
  },
  POSTPONE_HEARING: {
    code: 'Postpone a hearing',
    url: 'apply-to-postpone-my-hearing',
    type: ApplicationType.A,
  },
  VARY_OR_REVOKE_ORDER: {
    code: 'Vary or revoke an order',
    url: 'apply-to-vary-or-revoke-an-order',
    type: ApplicationType.A,
  },
  CONSIDER_DECISION_AFRESH: {
    code: 'Consider a decision afresh',
    url: 'apply-to-have-a-decision-considered-afresh',
    type: ApplicationType.B,
  },
  AMEND_RESPONSE: {
    code: 'Amend response',
    url: 'apply-to-amend-my-claim',
    type: ApplicationType.A,
  },
  ORDER_OTHER_PARTY: {
    code: 'Order other party',
    url: 'order-the-applicant-to-do-something',
    type: ApplicationType.A,
  },
  ORDER_WITNESS_ATTEND: {
    code: 'Order a witness to attend to give evidence',
    url: 'order-a-witness-to-give-evidence',
    type: ApplicationType.C,
  },
  CLAIMANT_NOT_COMPLIED: {
    code: 'Claimant not complied',
    url: 'notify-tribunal-applicant-has-not-complied-with-an-order',
    type: ApplicationType.A,
  },
  RESTRICT_PUBLICITY: {
    code: 'Restrict publicity',
    url: 'apply-to-restrict-publicity',
    type: ApplicationType.A,
  },
  STRIKE_OUT_CLAIM: {
    code: 'Strike out all or part of a claim',
    url: 'strike-out-all-or-part-of-application',
    type: ApplicationType.A,
  },
  RECONSIDER_JUDGMENT: {
    code: 'Reconsider judgment',
    url: 'apply-for-judgment-to-be-reconsidered',
    type: ApplicationType.B,
  },
  CONTACT_TRIBUNAL: {
    code: 'Contact the tribunal',
    url: 'contact-tribunal',
    type: ApplicationType.A,
  },
};

export const isTypeAOrB = (app: Application): boolean => {
  return app.type === ApplicationType.A || app.type === ApplicationType.B;
};

export const getApplicationByUrl = (url: string): Application | undefined => {
  return Object.values(application).find(app => app.url === url);
};
