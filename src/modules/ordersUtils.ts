/**
 * Imports
 */
import { IPagination } from '../interfaces/pagination';
import ObjectToAnswer from '../types/objectToAnswer';
import config from '../../configs/config';
import { Request } from 'express';
import DatabaseUtils from '../types/databaseUtils';
import { INestedUser } from '../interfaces/nestedUser';
import { IPage } from '../interfaces/page';


export default class OrdersUtils extends DatabaseUtils {


    constructor(req: Request) {
        super(req, 'Order');
    }

    public getPagesObjectList(currentPagination: IPagination, count: number): Array<IPage> {
        const currentLimit = currentPagination.limit;
        const currentSkip = currentPagination.skip;
        const currentSort = currentPagination.sort;
        console.log(count, currentLimit)
        const allPages: number = Math.ceil(Number(count)/currentLimit);
        const passedPages: number = allPages - Math.ceil(count/currentSkip);
        const newSkip: number = currentSkip + currentLimit;
        const currentPageNumber: number = allPages - Math.ceil(count/newSkip);
        const nextPages: number = allPages - currentPageNumber;

        let pagesList: Array<IPage> = [];
        let i: number;
        let tmpElement: IPage;
        let tmpSkip: number = 0;
        for(i = 0; i != allPages; i++) {
            
            tmpElement = {
                page: i+1,
                limit: currentLimit,
                sort: currentSkip,
                skip: tmpSkip,
                current: (currentPageNumber != i) ? true : false
            };

            console.log(tmpElement);
            pagesList.push(tmpElement);

            tmpSkip = tmpSkip + currentLimit;
        }

        console.log(pagesList)
        return pagesList;
    }


    private createNewNestedUser(username: string, isProductOwner: boolean, isFreelancer: boolean): INestedUser {
        const newNestedUser: INestedUser = {
            username,
            isProductOwner,
            isFreelancer
        };
        return newNestedUser;
    }

    public async updateOrder(req: Request): Promise<any> {
        try {
            const fieldToUpdate: Array<string> = Object.keys(req.body);
            const findedData = await this.findOne('full', { name: req.params.name});
            const findedEntry = (<any>findedData).answer.data[0];

            if(findedEntry != null) {

                for(let field of fieldToUpdate) {
                    if(field != 'owner' && field != 'freelancer' && field != 'save') {
                        (<any>findedEntry)[field] = req.body[field];
                    }
                }

                const nameOfOwner = ((<any>findedEntry).productOwner) ? ((<any>findedEntry).productOwner.username) : undefined;
                const nameOfFreelancer = ((<any>findedEntry).freelancer) ? (<any>findedEntry).freelancer.username : undefined;

                const newOwner: INestedUser = (req.body.owner) ? this.createNewNestedUser(req.body.owner, true, false) : undefined;
                const newFreelancer: INestedUser = (req.body.freelancer) ? this.createNewNestedUser(req.body.freelancer, false, true) : undefined;
                
                if(newOwner) (<any>findedEntry).productOwner = newOwner;
                if(newFreelancer) (<any>findedEntry).freelancer = newFreelancer;

                const updatedEntry = await findedEntry.save();
                const objectToAnswer: ObjectToAnswer = new ObjectToAnswer(undefined, 201, updatedEntry, undefined, undefined, undefined);
                const objectToReturn: Object = objectToAnswer.answerAfterSave()
                
                return objectToReturn;
            }
        } catch (error) {
            return error;
        }
    }
}
