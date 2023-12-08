const swaggerAutogen=require('swagger-autogen')();
const doc={
    info:{
        title: 'auth app',
        description: 'Description'
    },
    host: 'localhost:4000'
};

const outputFile= './swagger-output.json';
const routes = ['./routes/user.js'];

swaggerAutogen(outputFile,routes,doc);