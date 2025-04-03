export interface TseRequestNotification {
  from: string;
  appName: string;
  appUrl: string;
}

export interface TseSubmitNotification {
  from: string;
  appName: string;
  appType: string;
  dueDate: Date;
  appUrl: string;
}

export interface TseNotification {
  appRequestNotifications: TseRequestNotification[];
  appSubmitNotifications: TseSubmitNotification[];
}
