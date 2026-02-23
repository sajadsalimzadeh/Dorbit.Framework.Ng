export interface StatusLog<T> {
    status: T;
    time: string;
    userId?: string;
    description?: string;

    user?: any;
}