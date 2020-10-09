import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import {Dynamo} from '../common/Dynamo';
import {apiResponses} from '../common/Response';
const tableName = "highscore";

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    console.log('event', event);
    const game = event.pathParameters?.game;

    if (!game ) {
        return apiResponses._400({ message: 'missing game' });
    }


    const data = await Dynamo.getAll(tableName).catch(err => {
        console.log('error in Dynamo DB Get', err);
        return null;
    })


    
    if (!data){
        return apiResponses._400({ message: 'Failed to get User by ID' });
    }
    
    let response = filterPlayers(game.trim(), data.Items);
    return apiResponses._200({response});
 
};

function filterPlayers(game: string, data: IPlayer[]){
    let result = data.filter(player => player.game === game);
    result.sort(function(a,b){

        return b.score - a.score;
    });
    return result;
}

interface IPlayer {
    ID: string
    alias: string,
    game: string,
    score: number
}