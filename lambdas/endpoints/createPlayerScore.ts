import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import {Dynamo} from '../common/Dynamo';
import {apiResponses} from '../common/Response';
import * as uuid from 'uuid'

const tableName = "highscore";

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    console.log('event', event);
    const ID = uuid.v1();

    if (!ID ) {
        return apiResponses._400({ message: 'missing ID' });
    }

    const user = JSON.parse(event.body);
    user.ID = ID;
    
    const newUser = await Dynamo.write(user, tableName).catch(err => {
        console.log('error in dynamo write: ', {user}, err);
        return null;
    });
    
    if (!newUser){
        return apiResponses._400({ message: 'Failed to write mew User', newUser });
    }
    
    return apiResponses._200({user});
 
};


