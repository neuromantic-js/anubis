/**
 * Imports
 */
import { NestedUserSchema } from './UserNested';
import { Schema } from 'mongoose';
/**
 * Mongoose schema for order document
 */
export const OrderSchema: Schema = new Schema({
    name: {
        type: String,
        default: undefined,
        requierd: true
    },
    linkToTechnicalProject: {
        type: String,
        default: undefined
    },
    dates: {
        dateOfPublication: {
            type: Date,
            default: Date.now
        },
        dateStartOfWork: {
            type: Date,
            default: undefined
        },
        dateEndOfWork: {
            type: Date,
            default: undefined
        },
        dateOfRepublication: {
            type: Date,
            default: undefined
        },
        dateAcceptOfWorks: {
            type: Date,
            default: undefined
        }
    },
    state: {
        type: String,
        enum: ['created', 'mark-to-remove', 'in-progress', 'in-testing', 'finished', 'on-completion'],
        default: 'created'
    },
    description: {
        type: String,
        default: undefined
    },
    trustIndex: {
        type: Number,
        default: 0
    },
    /* Subdocuments */
    productOwner: {
        type: NestedUserSchema,
        default: undefined
    },
    freelancer: {
        type: NestedUserSchema,
        default: undefined
    }
}, {
    timestamps: {
        createAt: 'creationDate',
        updateAt: 'updatingDate'
    },
    strict: true
});