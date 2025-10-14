import { YesOrNo } from '../../../../main/definitions/case';
import { PartiesNotify, PartiesRespond } from '../../../../main/definitions/constants';
import { getNotificationCyaContent } from '../../../../main/helpers/controller/RespondToNotificationCYAHelper';
import commonJson from '../../../../main/resources/locales/en/translation/common.json';
import respondToApplicationCyaJson from '../../../../main/resources/locales/en/translation/respond-to-application-check-your-answers.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Respond to Notification CYA Helper', () => {
  describe('getNotificationCyaContent', () => {
    it('should generate the correct summary list for a complete case', () => {
      const translations = {
        ...commonJson,
        ...respondToApplicationCyaJson,
      };
      const req = mockRequestWithTranslation({}, translations);

      const userCase = req.session.userCase;
      userCase.selectedNotification = {
        id: '1',
        value: {
          sendNotificationTitle: 'Test',
          sendNotificationSelectParties: PartiesRespond.RESPONDENT,
          sendNotificationNotify: PartiesNotify.BOTH_PARTIES,
        },
      };
      userCase.responseText = 'Test response to notification';
      userCase.hasSupportingMaterial = YesOrNo.YES;
      userCase.supportingMaterialFile = {
        document_url: 'http://dm-store:8080/documents/6cd4768b-d9f8-4e39-b8e3-672f0047aa88',
        document_filename: 'TEST.txt',
        document_binary_url: 'http://dm-store:8080/documents/6cd4768b-d9f8-4e39-b8e3-672f0047aa88/binary',
      };
      userCase.copyToOtherPartyYesOrNo = YesOrNo.NO;
      userCase.copyToOtherPartyText = 'No Reason';

      const expectedRows = [
        {
          key: {
            classes: 'govuk-!-font-weight-regular-m',
            text: "What's your response to the tribunal?",
          },
          value: {
            text: userCase.responseText,
          },
          actions: {
            items: [
              {
                href: '/respond-to-notification/1?lng=en',
                text: 'Change',
                visuallyHiddenText: "What's your response to the tribunal?",
              },
            ],
          },
        },
        {
          key: {
            classes: 'govuk-!-font-weight-regular-m',
            text: 'Supporting material',
          },
          value: {
            html: '<a href="/getSupportingMaterial/6cd4768b-d9f8-4e39-b8e3-672f0047aa88" target="_blank">TEST.txt</a><br>',
          },
          actions: {
            items: [
              {
                href: '/respond-to-notification/1?lng=en',
                text: 'Change',
                visuallyHiddenText: 'Supporting material',
              },
            ],
          },
        },
        {
          key: {
            classes: 'govuk-!-font-weight-regular-m',
            text: 'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?',
          },
          value: {
            text: 'No',
          },
          actions: {
            items: [
              {
                href: '/respond-to-notification-copy-to-other-party?lng=en',
                text: 'Change',
                visuallyHiddenText:
                  'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?',
              },
            ],
          },
        },
        {
          key: {
            classes: 'govuk-!-font-weight-regular-m',
            text: 'Reason for not informing other party',
          },
          value: {
            text: userCase.copyToOtherPartyText,
          },
          actions: {
            items: [
              {
                href: '/respond-to-notification-copy-to-other-party?lng=en',
                text: 'Change',
                visuallyHiddenText: 'Reason for not informing other party',
              },
            ],
          },
        },
      ];

      const cyaContent = getNotificationCyaContent(req);

      expect(cyaContent).toEqual(expectedRows);
    });
  });
});
