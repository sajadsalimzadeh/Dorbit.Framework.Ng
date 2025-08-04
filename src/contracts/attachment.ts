export interface Attachment {
    id: string;
    name: string;
    filename: string;
    size: number;
    access: string;
    isPrivate: boolean;
    userIds?: string[];
    accessTokens?: string[];
    creationTime: string;
}

export interface AttachmentDto {
    name: string;
    filename: string;
    size: number;
}

export interface AttachmentUploadPrivateRequest {
    access: string;
}

export interface AttachmentPatchRequest {
    access?: string;
    userIds?: string[];
    accessTokens?: string[];
}