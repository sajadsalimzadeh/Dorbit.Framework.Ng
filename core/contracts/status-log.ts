import { User } from "@identity/contracts/user";

export interface StatusLog<T> {
    status: T;
    time: string;
    userId?: string;
    description?: string;

    user?: User;
}