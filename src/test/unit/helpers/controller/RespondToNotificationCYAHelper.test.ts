import { YesOrNo } from '../../../../main/definitions/case';
import { PartiesNotify, PartiesRespond } from '../../../../main/definitions/constants';
import { getNotificationCyaContent } from '../../../../main/helpers/controller/RespondToNotificationCYAHelper';
import commonJson from '../../../../main/resources/locales/en/translation/common.json';
import respondToApplicationCyaJson from '../../../../main/resources/locales/en/translation/respond-to-application-check-your-answers.json';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';

describe('Respond to Notification CYA Helper', () => {
  describe('getNotificationCyaContent', () => {
    const translations = {
      ...commonJson,
      ...respondToApplicationCyaJson,
    };

    it('should generate the correct summary list for a complete case', () => {
      const req = mockRequestWithTranslation({}, translations);
      req.session.userCase = {
        ...req.session.userCase,
        selectedNotification: {
          id: '1',
          value: {
            sendNotificationTitle: 'Test',
            sendNotificationSelectParties: PartiesRespond.RESPONDENT,
            sendNotificationNotify: PartiesNotify.BOTH_PARTIES,
          },
        },
        responseText: 'Test response to notification',
        hasSupportingMaterial: YesOrNo.YES,
        supportingMaterialFile: {
          document_url: 'http://dummy/documents/6cd4768b-d9f8-4e39-b8e3-672f0047aa88',
          document_filename: 'TEST.txt',
          document_binary_url: 'http://dummy/documents/6cd4768b-d9f8-4e39-b8e3-672f0047aa88/binary',
        },
        copyToOtherPartyYesOrNo: YesOrNo.NO,
        copyToOtherPartyText: 'No Reason',
      };

      const cyaContent = getNotificationCyaContent(req);
      expect(cyaContent).toHaveLength(4);
      expect(cyaContent[0].key.text).toEqual("What's your response to the tribunal?");
      expect(cyaContent[0].value.text).toEqual('Test response to notification');
      expect(cyaContent[0].actions.items[0].href).toEqual('/respond-to-notification/1?lng=en');
      expect(cyaContent[1].key.text).toEqual('Supporting material');
      expect(cyaContent[1].value.html).toEqual(
        '<a href="/getSupportingMaterial/6cd4768b-d9f8-4e39-b8e3-672f0047aa88" target="_blank">TEST.txt</a><br>'
      );
      expect(cyaContent[1].actions.items[0].href).toEqual('/respond-to-notification/1?lng=en');
      expect(cyaContent[2].key.text).toEqual(
        'Do you want to copy this correspondence to the other party to satisfy the Rules of Procedure?'
      );
      expect(cyaContent[2].value.text).toEqual('No');
      expect(cyaContent[2].actions.items[0].href).toEqual(
        '/respond-to-notification-copy-to-other-party-offline?lng=en'
      );
      expect(cyaContent[3].key.text).toEqual('Reason for not informing other party');
      expect(cyaContent[3].value.text).toEqual('No Reason');
      expect(cyaContent[3].actions.items[0].href).toEqual(
        '/respond-to-notification-copy-to-other-party-offline?lng=en'
      );
    });
  });
});
