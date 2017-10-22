import { NestedUser } from '../schemas/NestedUser';

export interface IOrder {
    name: string,
    dates?: {
        dateOfPublication?: Date,
        dateStartOfWork?: Date,
        dateEndOfWork?: Date,
        dateOfRepublication?: Date,
        dateAcceptOfWorks?: Date 
    },
    state?: string,
    description?: string,
    productOwner?: NestedUser,
    freelancer?: NestedUser,
    trustIndex?: number,
    linkToTechnicalProject?: string
}