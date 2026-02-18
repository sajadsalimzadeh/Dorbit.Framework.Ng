export interface OwnerLog {
    user: string;
    requrestTime: string;
    decideTime: string;
    isAccept: boolean;
}

export interface OwnerDecideRequest {
    isAccept: boolean;
    description?: string;
}