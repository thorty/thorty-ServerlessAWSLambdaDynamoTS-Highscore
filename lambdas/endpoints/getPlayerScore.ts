import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import {Dynamo} from '../common/Dynamo';
import {apiResponses} from '../common/Response';
const tableName = "highscore";

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    console.log('event', event);
    const ID = event.pathParameters?.playerId;

    if (!ID ) {
        return apiResponses._400({ message: 'missing ID' });
    }


    const user = await Dynamo.get(ID, tableName).catch(err => {
        console.log('error in Dynamo DB Get', err);
        return null;
    })
    
    if (!user){
        return apiResponses._400({ message: 'Failed to get User by ID' });
    }
    
    return apiResponses._200({user});
 
};


