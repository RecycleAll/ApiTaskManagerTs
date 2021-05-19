import {config} from "dotenv";
config();
import express, {Express} from "express";
import bodyParser from "body-parser";

import {buildRoutes} from "./src/routes";
import {SequelizeManager} from "./src/models";


const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "TaskManager",
            version: "1.0.0",
            description: "API for TaskManagerAPp"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ],
    },
    apis: ["./src/routes/*.route.ts"]
}

const specs = swaggerJsDoc(options);

const app: Express = express();

app.use(bodyParser.json());
app.use("/doc", swaggerUI.serve, swaggerUI.setup(specs))

buildRoutes(app);

SequelizeManager.getInstance();

const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log(`Listening on ${port}...`);
});
