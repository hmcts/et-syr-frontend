export interface NotificationDetails {
  isResponseRequired: boolean;
  redirectUrl: string;
  notificationTitle: string;
}

export interface PseNotification {
  anyResponseRequired: boolean;
  notificationList: NotificationDetails[];
}
