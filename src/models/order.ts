/**
 * Imports
 */
import { IOrder } from '../interfaces/order';
import { Document } from 'mongoose';


/**
 * 
 */
export interface IOrderModel extends IOrder, Document { }
