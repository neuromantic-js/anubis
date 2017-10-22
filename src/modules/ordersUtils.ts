/**
 * Imports
 */
import { Request } from 'express';
import DatabaseUtils from '../types/databaseUtils';


export default class OrdersUtils extends DatabaseUtils {


    constructor(req: Request) {
        super(req, 'Order');
    }
}
