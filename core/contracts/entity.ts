export interface Entity {
    id: string;
}

export interface CreateEntity extends Entity {
    creationTime: string;
    creatorId: string;
    creatorName: string;
}

export interface FullEntity extends CreateEntity {
    modificationTime: string;
    modifierId: string;
    modifierName: string;
    deletionTime: string;
    deleterId: string;
    deleterName: string;
    isDeleted: boolean;
}

export interface CreationEntity extends Entity {
    creationTime: string;
    creatorId: string;
    creatorName: string;
}