import { YesOrNo } from '../../../main/definitions/case';
import { GenericTseApplicationTypeItem } from '../../../main/definitions/complexTypes/genericTseApplicationTypeItem';

export const mockGenericTseCollection: GenericTseApplicationTypeItem[] = [
  {
    id: '04a5064e-0766-4833-b740-d02520c604f2',
    value: {
      date: '3 February 2025',
      type: 'Amend my claim',
      number: '1',
      status: 'Open',
      details: 'Text Apply to amend my claim',
      dueDate: '10 February 2025',
      applicant: 'Claimant',
      documentUpload: {
        document_url: 'http://dm-store:8080/documents/04ee9057-4d4b-44d0-b371-6bb396f078ca',
        document_filename: 'Application 1 - Amend my claim - Attachment.txt',
        document_binary_url: 'http://dm-store:8080/documents/04ee9057-4d4b-44d0-b371-6bb396f078ca/binary',
      },
      responsesCount: '0',
      applicationState: 'notStartedYet',
      respondCollection: [
        {
          id: '1a17e36a-62ed-4c72-9421-dd6afdccd728',
          value: {
            date: '3 February 2025',
            from: 'Admin',
            addDocument: [
              {
                id: '5fc2e2bd-05ac-4491-b70c-8f1121bce3cb',
                value: {
                  shortDescription: 'Short description 1-1-1',
                  uploadedDocument: {
                    document_url: 'http://dm-store:8080/documents/cdaf047b-492a-4d8a-8f6b-2c075d2fd44d',
                    document_filename: 'Test.pdf',
                    document_binary_url: 'http://dm-store:8080/documents/cdaf047b-492a-4d8a-8f6b-2c075d2fd44d/binary',
                  },
                },
              },
              {
                id: '2cef9f89-f10c-41eb-831a-399ee9053645',
                value: {
                  shortDescription: 'Short description 1-1-2',
                  uploadedDocument: {
                    document_url: 'http://dm-store:8080/documents/cf387bf9-8045-4f1b-b155-66b1b181e9cf',
                    document_filename: 'TEST.txt',
                    document_binary_url: 'http://dm-store:8080/documents/cf387bf9-8045-4f1b-b155-66b1b181e9cf/binary',
                  },
                },
              },
            ],
            requestMadeBy: 'Judge',
            isCmoOrRequest: 'Request',
            madeByFullName: 'Full Name',
            selectPartyNotify: 'Both parties',
            enterResponseTitle: 'Title 1-1',
            isResponseRequired: 'Yes',
            selectPartyRespond: 'Both parties',
            additionalInformation: 'Additional information 1-1',
          },
        },
      ],
      copyToOtherPartyYesOrNo: YesOrNo.YES,
      claimantResponseRequired: 'Yes',
      respondentResponseRequired: 'Yes',
    },
  },
  {
    id: '5d0118c9-bdd6-4d32-9131-6aa6f5ec718e',
    value: {
      date: '3 February 2025',
      type: 'Amend response',
      number: '2',
      status: 'Open',
      details: 'Text Amend response',
      dueDate: '10 February 2025',
      applicant: 'Respondent',
      documentUpload: {
        document_url: 'http://dm-store:8080/documents/e760f197-7611-41ae-bbcd-7f92194f6074',
        document_filename: 'Application 2 - App to amend response - Attachment.txt',
        document_binary_url: 'http://dm-store:8080/documents/e760f197-7611-41ae-bbcd-7f92194f6074/binary',
      },
      responsesCount: '0',
      applicationState: 'notStartedYet',
      respondCollection: [
        {
          id: 'b3266fe3-c0d7-42a0-97c8-98d82816c084',
          value: {
            date: '3 February 2025',
            from: 'Admin',
            cmoMadeBy: 'Legal officer',
            addDocument: [
              {
                id: 'a259041d-0b19-40f0-8407-00854878a208',
                value: {
                  shortDescription: 'Short description 2-1-1',
                  uploadedDocument: {
                    document_url: 'http://dm-store:8080/documents/4b378c7a-7b77-4146-8ebe-0649926fb82f',
                    document_filename: 'TEST.txt',
                    document_binary_url: 'http://dm-store:8080/documents/4b378c7a-7b77-4146-8ebe-0649926fb82f/binary',
                  },
                },
              },
              {
                id: 'ef296f8f-34b5-42d0-8568-a7388c5a3f83',
                value: {
                  shortDescription: 'Short description 2-1-2',
                  uploadedDocument: {
                    document_url: 'http://dm-store:8080/documents/f7e026b5-17ba-47b3-9615-807ecde2aa1a',
                    document_filename: 'Test.pdf',
                    document_binary_url: 'http://dm-store:8080/documents/f7e026b5-17ba-47b3-9615-807ecde2aa1a/binary',
                  },
                },
              },
            ],
            isCmoOrRequest: 'Case management order',
            madeByFullName: 'Full Name',
            selectPartyNotify: 'Both parties',
            enterResponseTitle: 'Title 2-1',
            isResponseRequired: 'Yes',
            selectPartyRespond: 'Both parties',
            additionalInformation: 'Additional information 2-1',
          },
        },
      ],
      copyToOtherPartyYesOrNo: YesOrNo.YES,
      claimantResponseRequired: 'Yes',
      respondentResponseRequired: 'Yes',
    },
  },
];
