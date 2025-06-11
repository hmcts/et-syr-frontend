import { SendNotificationTypeItem } from '../../../main/definitions/complexTypes/sendNotificationTypeItem';
import { NotificationSubjects } from '../../../main/definitions/constants';

export const selectedRequestOrOrder: SendNotificationTypeItem = {
  id: '123',
  value: {
    number: '1',
    sendNotificationTitle: 'title',
    sendNotificationSubjectString: NotificationSubjects.ORDER_OR_REQUEST,
    sendNotificationSelectHearing: {
      selectedLabel: 'Hearing',
    },
    date: '2019-05-03',
    sentBy: 'Tribunal',
    sendNotificationCaseManagement: 'Order',
    sendNotificationResponseTribunal: 'required',
    sendNotificationSelectParties: 'Both',
    sendNotificationAdditionalInfo: 'additional info',
    sendNotificationWhoCaseOrder: 'Legal officer',
    sendNotificationFullName: 'Judge Dredd',
    sendNotificationNotify: 'Both',
    notificationState: 'notViewedYet',
  },
};
