import { YesOrNo } from '../../../main/definitions/case';
import { SendNotificationTypeItem } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';

export const mockSendNotificationCollection: SendNotificationTypeItem[] = [
  {
    id: 'd416f43f-10f4-402a-bdf1-ea9012a553d7',
    value: {
      date: '2 October 2025',
      number: '9',
      notificationState: 'notStartedYet',
      respondCollection: [
        {
          id: 'e413ab5a-f427-4a6c-a22b-1ee7b736d128',
          value: {
            date: '2 October 2025',
            from: 'Respondent',
            response: 'Rep-Response-1',
            copyToOtherParty: 'Yes',
            supportingMaterial: [
              {
                id: 'fb9dd2fe-e7de-46a7-94c2-62d3a4a501e1',
                value: {
                  shortDescription: 'Test Short description R',
                  uploadedDocument: {
                    document_url: 'http://dummy/documents/bac9bb00-3602-4ac3-8848-118df0703f0f',
                    document_filename: 'Test.pdf',
                    document_binary_url: 'http://dummy/documents/bac9bb00-3602-4ac3-8848-118df0703f0f/binary',
                  },
                },
              },
            ],
            hasSupportingMaterial: 'Yes',
          },
        },
      ],
      sendNotificationTitle: 'Noti-Test-1',
      sendNotificationLetter: YesOrNo.YES,
      sendNotificationNotify: 'Both parties',
      sendNotificationSentBy: 'Tribunal',
      sendNotificationSubject: [
        'Claimant / Respondent details',
        'Case management orders / requests',
        'Claim (ET1)',
        'Response (ET3)',
        'Judgment',
        'Hearing',
        'Other (General correspondence)',
      ],
      sendNotificationDecision: 'Granted',
      sendNotificationFullName: 'Test Name 1',
      sendNotificationFullName2: 'Test Name 2',
      sendNotificationWhoCaseOrder: 'Legal officer',
      sendNotificationSelectHearing: {
        selectedCode: '86002f38-ed93-45a2-9450-cdf6bff0e272',
        selectedLabel: '1: Hearing - Hull Combined Court Centre - 24 February 2025 10:00',
      },
      sendNotificationSelectParties: 'Both parties',
      sendNotificationSubjectString:
        'Claimant / Respondent details, Case management orders / requests, Claim (ET1), Response (ET3), Judgment, Hearing, Other (General correspondence)',
      sendNotificationAdditionalInfo: 'Test Additional information 1',
      sendNotificationCaseManagement: 'Case management order',
      sendNotificationResponsesCount: '1',
      sendNotificationUploadDocument: [
        {
          id: 'b7ee841c-bbc0-4f50-a1c9-2ef9ae471f9d',
          value: {
            shortDescription: 'Test Short description',
            uploadedDocument: {
              document_url: 'http://dummy/documents/de0a61e4-0f76-4004-8bd3-7535c815db31',
              document_filename: 'Test.pdf',
              document_binary_url: 'http://dummy/documents/de0a61e4-0f76-4004-8bd3-7535c815db31/binary',
            },
          },
        },
      ],
      sendNotificationResponseTribunal: 'Yes - view document for details',
      sendNotificationWhoMadeJudgement: 'Judge',
      respondNotificationTypeCollection: [
        {
          id: '24b5233b-f2c7-42f2-9f4f-8852d6277709',
          value: {
            state: 'notStartedYet',
            isClaimantResponseDue: 'Yes',
            respondNotificationDate: '2 October 2025',
            respondNotificationTitle: 'T-Response-1',
            respondNotificationFullName: 'Test Name',
            respondNotificationWhoRespond: 'Both parties',
            respondNotificationCmoOrRequest: 'Case management order',
            respondNotificationPartyToNotify: 'Both parties',
            respondNotificationAdditionalInfo: 'Test Additional information A1',
            respondNotificationUploadDocument: [
              {
                id: 'e65942c8-03c4-4cf1-ad9e-f128adbd9837',
                value: {
                  shortDescription: 'Test Short description A1',
                  uploadedDocument: {
                    document_url: 'http://dummy/documents/2654b6b1-4877-49ea-9bd2-15a0727809c6',
                    document_filename: 'Test.pdf',
                    document_binary_url: 'http://dummy/documents/2654b6b1-4877-49ea-9bd2-15a0727809c6/binary',
                  },
                },
              },
            ],
            respondNotificationResponseRequired: 'Yes',
            respondNotificationCaseManagementMadeBy: 'Legal officer',
          },
        },
      ],
      sendNotificationResponseTribunalTable: YesOrNo.YES,
    },
  },
];
