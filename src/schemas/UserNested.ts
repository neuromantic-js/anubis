/**
 * Imports
 */
import { Schema } from 'mongoose';
/**
 * Mongoose schema for order document
 */
export const NestedUserSchema: Schema = new Schema({
    username: {
        type: String,
        default: undefined
    },
    phone: {
        type: Number,
        default: undefined
    },
    email: {
        type: String,
        default: undefined
    },
    isProductOwner: {
        type: Boolean,
        default: false
    },
    isFreelancer: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: {
        createAt: 'creationDate',
        updateAt: 'updatingDate'
    },
    strict: true
});