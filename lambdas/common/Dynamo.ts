import { DynamoDB } from 'aws-sdk'

const documentClient = new DynamoDB.DocumentClient();

export const Dynamo = {
    async get(ID, TableName) {
        const params = {
            TableName,
            Key: {
                ID,
            },
        };

        const data = await documentClient.get(params).promise();

        if (!data || !data.Item) {
            throw Error(`There was an error fetching the data for ID of ${ID} from ${TableName}`);
        }
        console.log(data);

        return data.Item;
    },
    async getAll(TableName) {       

        const data = await documentClient.scan({TableName}).promise();

        if (!data ) {
            throw Error(`There was an error fetching the data from ${TableName}`);
        }
        console.log(data);

        return data;
    },    
    
    async write(data:any, TableName:string) {
        if (!data.ID){
            throw Error('no ID on the data');
        }
        const params = {
            TableName,
            Item: data
        };

        const res = await documentClient.put(params).promise();

        if (!res){
            throw Error(`There was an error inserting ID of ${data.ID} in table ${TableName}`);
        }

        return data;

    }
};
