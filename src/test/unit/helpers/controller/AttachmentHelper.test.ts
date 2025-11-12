import { AppRequest } from '../../../../main/definitions/appRequest';
import { Applicant } from '../../../../main/definitions/constants';
import { isDocIdValid } from '../../../../main/helpers/controller/AttachmentHelper';
import { mockRequest } from '../../mocks/mockRequest';

describe('Attachment Helper', () => {
  describe('isDocIdValid', () => {
    const docId1 = 'contactDoc123';
    const docId2 = 'supportDoc456';
    const docId3 = 'appDoc789';
    const docId4 = 'respondDoc101';
    const docId5 = 'decisionDoc202';
    const docId6 = 'notificationDoc303';
    const docId7 = 'tribunalResponseDoc404';
    const docId8 = 'responseDoc505';

    const req: AppRequest = mockRequest({
      session: {
        userCase: {
          contactApplicationFile: {
            document_url: `http://doc/${docId1}`,
            document_filename: 'file',
            document_binary_url: 'binurl',
          },
          supportingMaterialFile: {
            document_url: `http://doc/${docId2}`,
            document_filename: 'file',
            document_binary_url: 'binurl',
          },
          genericTseApplicationCollection: [
            {
              value: {
                documentUpload: {
                  document_url: `http://doc/${docId3}`,
                  document_filename: 'file',
                  document_binary_url: 'binurl',
                },
                respondCollection: [
                  {
                    value: {
                      from: Applicant.RESPONDENT,
                      supportingMaterial: [
                        {
                          value: {
                            uploadedDocument: {
                              document_url: `http://doc/${docId4}`,
                              document_filename: 'file',
                              document_binary_url: 'binurl',
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
                adminDecision: [
                  {
                    value: {
                      responseRequiredDoc: [
                        {
                          value: {
                            uploadedDocument: {
                              document_url: `http://doc/${docId5}`,
                              document_filename: 'file',
                              document_binary_url: 'binurl',
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
          tseRespondentStoredCollection: [],
          sendNotificationCollection: [
            {
              value: {
                sendNotificationUploadDocument: [
                  {
                    value: {
                      uploadedDocument: {
                        document_url: `http://doc/${docId6}`,
                        document_filename: 'file',
                        document_binary_url: 'binurl',
                      },
                    },
                  },
                ],
                respondNotificationTypeCollection: [
                  {
                    id: '1',
                    value: {
                      respondNotificationUploadDocument: [
                        {
                          value: {
                            uploadedDocument: {
                              document_url: `http://doc/${docId7}`,
                              document_filename: 'file',
                              document_binary_url: 'binurl',
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
                respondCollection: [
                  {
                    id: '2',
                    value: {
                      supportingMaterial: [
                        {
                          value: {
                            uploadedDocument: {
                              document_url: `http://doc/${docId8}`,
                              document_filename: 'file',
                              document_binary_url: 'binurl',
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    });

    it('should validate docId from contactApplicationFile', () => {
      expect(isDocIdValid(docId1, req)).toBe(true);
    });

    it('should validate docId from supportingMaterialFile', () => {
      expect(isDocIdValid(docId2, req)).toBe(true);
    });

    it('should validate docId from genericTseApplicationCollection documentUpload', () => {
      expect(isDocIdValid(docId3, req)).toBe(true);
    });

    it('should validate docId from respondCollection supportingMaterial', () => {
      expect(isDocIdValid(docId4, req)).toBe(true);
    });

    it('should validate docId from adminDecision responseRequiredDoc', () => {
      expect(isDocIdValid(docId5, req)).toBe(true);
    });

    it('should validate docId from sendNotificationUploadDocument', () => {
      expect(isDocIdValid(docId6, req)).toBe(true);
    });

    it('should validate docId from respondNotificationTypeCollection respondNotificationUploadDocument', () => {
      expect(isDocIdValid(docId7, req)).toBe(true);
    });

    it('should validate docId from respondCollection supportingMaterial in notification', () => {
      expect(isDocIdValid(docId8, req)).toBe(true);
    });

    it('should return false for invalid docId', () => {
      expect(isDocIdValid('invalidDocId', req)).toBe(false);
    });
  });
});
