export * from './store';
export * from './table';

import {StoreDb} from "./table";

export enum NotificationType {
    Normal = 0,
    Success = 1,
    Warning = 2,
    Danger = 3,
    Link = 4,
    Primary = 5,
    Secondary = 6,
}

export function getNotificationTypeString(value: NotificationType) {
    if (value == NotificationType.Success) return 'success';
    if (value == NotificationType.Warning) return 'warning';
    if (value == NotificationType.Danger) return 'danger';
    if (value == NotificationType.Link) return 'link';
    if (value == NotificationType.Primary) return 'primary';
    if (value == NotificationType.Secondary) return 'secondary';
    return 'white';
}

export function getNotificationTypeIcon(value: NotificationType) {
    if (value == NotificationType.Success) return 'fal fa-badge-check';
    if (value == NotificationType.Warning) return 'fal fa-triangle-exclamation';
    if (value == NotificationType.Danger) return 'fal fa-circle-exclamation';
    if (value == NotificationType.Link) return 'fal fa-circle-info';
    if (value == NotificationType.Primary) return 'fal fa-grid-2';
    if (value == NotificationType.Secondary) return 'fal fa-rocket-launch';
    return 'fal fa-bells';
}

export interface NotificationRecord {
    key: number;
    id: string;
    title: string;
    body: string;
    type: NotificationType;
    icon?: string;
    image?: string;

    creationTime: string;
}

const frameworkStore = new StoreDb('talakar', 1, {
    notifications: {key: 'key', autoIncrement: true}
});

export const notifications = frameworkStore.getTable<NotificationRecord>('notifications');
