# Trabajo páctico lambda-dynamo

Es una api de con 3 endopints CRUD para una base de datos de envios en dynamoDB

Los programas requeridos para correr la api son:
+Docker
+NodeJS (14 o superior)
+NPM
+Sam

Para correrla primero hace falta crear una network en docker, donde correr la correr la base de datos dynamo:

`docker network create awslocal`
`docker run --rm -p 8000:8000 --network awslocal --name dynamodb amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb`

Luego se debe clonar (o descargar como zip) este repositorio, instalamar las dependencias de aws y correr sam:

`npm install --save aws-sdk`
`sam local start-api --docker-network awslocal`

Para crear la tabla se debe ingresar en el navegador a `localhost:8000/shell/` y en el cuadrado de la izquierda pegamos el texto del archivo `createTable.txt`.

Con la base de datos creada y la api corriendo, ya esta todo listo para probar los endpoints:

GET /envios/pendientes
PUT /envios/{idEnvio}/entregado
POST /envios
Con un body de la forma:
`{
"destino": "destino",
"email": "email",
}`

Repositorio generado para la catedra de Computacion en la Nube, UTN-FRM, 2021
