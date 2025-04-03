export interface TseRequestNotification {
  from: string;
  appName: string;
  appUrl: string;
}

export interface TseSubmitNotification {
  from: string;
  appName: string;
  isTypeB: boolean;
  dueDate: Date;
  appUrl: string;
}

export interface TseNotification {
  appRequestNotifications: TseRequestNotification[];
  appSubmitNotifications: TseSubmitNotification[];
}
