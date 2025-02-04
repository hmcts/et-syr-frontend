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
      adminDecision: [
        {
          id: '736be7f2-9ea5-4546-9291-b933118a43c3',
          value: {
            date: '4 February 2025',
            decision: 'Granted',
            decisionMadeBy: 'Legal officer',
            typeOfDecision: 'Judgment',
            selectPartyNotify: 'Both parties',
            responseRequiredDoc: [
              {
                id: '56498494-5a2d-457a-887e-c023ee673317',
                value: {
                  shortDescription: 'Short description 1-D',
                  uploadedDocument: {
                    document_url: 'http://dm-store:8080/documents/efc6fc99-cbcf-4fa5-8092-325bf47f97a5',
                    document_filename: 'TEST.txt',
                    document_binary_url: 'http://dm-store:8080/documents/efc6fc99-cbcf-4fa5-8092-325bf47f97a5/binary',
                  },
                },
              },
            ],
            additionalInformation: 'Additional information 1-D',
            decisionMadeByFullName: 'Full name D',
            enterNotificationTitle: 'Title 1-D',
          },
        },
      ],
      documentUpload: {
        document_url: 'http://dm-store:8080/documents/04ee9057-4d4b-44d0-b371-6bb396f078ca',
        document_filename: 'Application 1 - Amend my claim - Attachment.txt',
        document_binary_url: 'http://dm-store:8080/documents/04ee9057-4d4b-44d0-b371-6bb396f078ca/binary',
      },
      responsesCount: '3',
      applicationState: 'notViewedYet',
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
        {
          id: '3f0460c8-0b46-4dcb-a22e-63482e51a6b2',
          value: {
            date: '4 February 2025',
            from: 'Respondent',
            copyToOtherParty: 'Yes',
            supportingMaterial: [
              {
                id: '99cd558b-5a92-468f-95f5-1caf00d4d0b2',
                value: {
                  uploadedDocument: {
                    document_url: 'http://dm-store:8080/documents/6cd4768b-d9f8-4e39-b8e3-672f0047aa88',
                    document_filename: 'TEST.txt',
                    document_binary_url: 'http://dm-store:8080/documents/6cd4768b-d9f8-4e39-b8e3-672f0047aa88/binary',
                  },
                },
              },
              {
                id: 'e4793902-6d40-4b98-8adb-545970c4884f',
                value: {
                  uploadedDocument: {
                    document_url: 'http://dm-store:8080/documents/61559544-487c-45cd-b6d0-bb78e071ebac',
                    document_filename: 'Test.pdf',
                    document_binary_url: 'http://dm-store:8080/documents/61559544-487c-45cd-b6d0-bb78e071ebac/binary',
                  },
                },
              },
            ],
            hasSupportingMaterial: YesOrNo.YES,
          },
        },
        {
          id: '21858944-1650-438f-91b0-dd153fb352c9',
          value: {
            date: '04 Feb 2025',
            from: 'Claimant',
            response: 'response 1-C',
            copyToOtherParty: 'Yes',
            supportingMaterial: [
              {
                id: '007f2a2d-a8a0-47b6-b539-7b237efa958a',
                value: {
                  uploadedDocument: {
                    document_url: 'http://dm-store:8080/documents/fa26d905-9f87-4232-beb6-c6b3a730e34f',
                    document_filename: 'Application 1 - Amend my claim - Attachment.txt',
                    document_binary_url: 'http://dm-store:8080/documents/fa26d905-9f87-4232-beb6-c6b3a730e34f/binary',
                  },
                },
              },
            ],
            hasSupportingMaterial: YesOrNo.YES,
          },
        },
      ],
      copyToOtherPartyYesOrNo: YesOrNo.YES,
      claimantResponseRequired: 'No',
      respondentResponseRequired: 'No',
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
      adminDecision: [
        {
          id: '9c60cffa-0f4d-4f5e-bccc-f84f8820b4e5',
          value: {
            date: '4 February 2025',
            decision: 'Granted in part',
            decisionMadeBy: 'Judge',
            typeOfDecision: 'Case management order',
            selectPartyNotify: 'Both parties',
            responseRequiredDoc: [
              {
                id: 'ebfbdef4-7ca0-4073-9a64-08de62431a53',
                value: {
                  shortDescription: 'Short description 1-D-1',
                  uploadedDocument: {
                    document_url: 'http://dm-store:8080/documents/e3eea072-c30e-4002-bed8-6d60a508cd4b',
                    document_filename: 'TEST.txt',
                    document_binary_url: 'http://dm-store:8080/documents/e3eea072-c30e-4002-bed8-6d60a508cd4b/binary',
                  },
                },
              },
              {
                id: 'a5befbb2-3a9e-4a68-8efe-2512d324624a',
                value: {
                  shortDescription: 'Short description 1-D-2',
                  uploadedDocument: {
                    document_url: 'http://dm-store:8080/documents/bab9a856-cfc4-49e3-b783-6bc477f35e50',
                    document_filename: 'TEST.txt',
                    document_binary_url: 'http://dm-store:8080/documents/bab9a856-cfc4-49e3-b783-6bc477f35e50/binary',
                  },
                },
              },
            ],
            additionalInformation: 'Additional information 1-D',
            decisionMadeByFullName: 'Full name D',
            enterNotificationTitle: 'Title 2-D',
          },
        },
      ],
      documentUpload: {
        document_url: 'http://dm-store:8080/documents/e760f197-7611-41ae-bbcd-7f92194f6074',
        document_filename: 'Application 2 - App to amend response - Attachment.txt',
        document_binary_url: 'http://dm-store:8080/documents/e760f197-7611-41ae-bbcd-7f92194f6074/binary',
      },
      responsesCount: '3',
      applicationState: 'notViewedYet',
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
        {
          id: '8f6267b4-3a83-46d9-8439-0c3981e7df95',
          value: {
            date: '4 February 2025',
            from: 'Respondent',
            copyToOtherParty: 'Yes',
            supportingMaterial: [
              {
                id: '46de053e-1612-43b4-aef1-09cc3fb8ebcf',
                value: {
                  uploadedDocument: {
                    document_url: 'http://dm-store:8080/documents/443e63d2-8010-49c1-adb6-40003488dc15',
                    document_filename: 'Test.pdf',
                    document_binary_url: 'http://dm-store:8080/documents/443e63d2-8010-49c1-adb6-40003488dc15/binary',
                  },
                },
              },
              {
                id: '95609de1-be70-4a58-a1b0-127d3c228d78',
                value: {
                  uploadedDocument: {
                    document_url: 'http://dm-store:8080/documents/af87f723-1fef-4c45-9dc1-c0cc027ede67',
                    document_filename: 'TEST.txt',
                    document_binary_url: 'http://dm-store:8080/documents/af87f723-1fef-4c45-9dc1-c0cc027ede67/binary',
                  },
                },
              },
            ],
            hasSupportingMaterial: YesOrNo.YES,
          },
        },
        {
          id: '2eb86119-3c9a-468d-b0f6-dde450f8868a',
          value: {
            date: '04 Feb 2025',
            from: 'Claimant',
            response: 'response 2-C',
            copyToOtherParty: 'Yes',
            supportingMaterial: [
              {
                id: 'b61f9357-724d-4997-ae32-f4a349a2bf5b',
                value: {
                  uploadedDocument: {
                    document_url: 'http://dm-store:8080/documents/f703d1d6-85b4-4020-bff0-2b544857ea46',
                    document_filename: 'Application 2 - Amend response - Attachment.txt',
                    document_binary_url: 'http://dm-store:8080/documents/f703d1d6-85b4-4020-bff0-2b544857ea46/binary',
                  },
                },
              },
            ],
            hasSupportingMaterial: YesOrNo.YES,
          },
        },
      ],
      copyToOtherPartyYesOrNo: YesOrNo.YES,
      claimantResponseRequired: 'No',
      respondentResponseRequired: 'No',
    },
  },
];
