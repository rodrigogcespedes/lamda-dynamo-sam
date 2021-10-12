let response;
const uuidv4 = require("uuid/v4")
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
 var AWS = require('aws-sdk');

 var dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10',
    endpoint: 'http://dynamodb:8000',
    region: 'us-west-2',
    credentials: {
    accessKeyId: '2345',
    secretAccessKey: '2345'
    }
    });
var docClient = new AWS.DynamoDB.DocumentClient({
    apiVersion: '2012-08-10',
    service: dynamodb
    });

exports.get_handler = async (event, context) => {
    var consulta = {
        TableName: 'Envio',
        IndexName: 'Pendiente_index',
        Select: 'ALL_ATTRIBUTES'
    };
    results = docClient.scan(consulta).promise();
    response = results.then((data) => {
        var devol = [];
        data.Items.forEach((thing) => {
            var aux = JSON.stringify(thing);
            devol.push(aux);
        });
        if (devol.length>0){
            return {
                'statusCode': 200,
                'body': JSON.parse(JSON.stringify(devol))
            };
        }
        else{
            return {
                'statusCode': 400,
                'body': JSON.stringify({message:"No hay ningun envio pendiente en este momento"})
            };
        }
    }).catch((err) => {
        console.log("Error: ", err);
    });
    return response
};

exports.put_handler = async (event, context) => {
    var params = {
        TableName: 'Envio',
        Key: {
            id : event.pathParameters.idEnvio
        },
        ConditionExpression: 'attribute_exists(pendiente)',
        UpdateExpression: 'REMOVE pendiente',
        ReturnValues: 'ALL_NEW'
        };

    rel = docClient.update(params).promise();
    response = rel.then((data) => {
        return {
            'statusCode': 200,
            'body': JSON.stringify({id:event.pathParameters.idEnvio})
        };
    }).catch((err) => {
        console.log("Error: ", err);
        return {
            'statusCode': 400,
            'body': JSON.stringify({error:"El id ingresado no se corresponde con ningun envio que se encuentre pendiente"})
        };
    });
    return response
};

exports.post_handler = async (event, context) => {
    var puts = {
        TableName: 'Envio',
        Item: {
            id: uuidv4(),
            fechaAlta: new Date().toISOString(),
            destino: JSON.parse(event.body).destino,
            email: JSON.parse(event.body).email,
            pendiente: 'Si'
        }
    };

    results = docClient.put(puts).promise();
    response = results.then((data) => {
        return {
            'statusCode': 201,
            'body': JSON.stringify(puts)
        };
    }).catch((err) => {
        console.log("Error: ", err);
        return {
            'statusCode': 409,
            'body': JSON.stringify({error:"No se pudo crear el envio"})
        };
    });
    return response
};