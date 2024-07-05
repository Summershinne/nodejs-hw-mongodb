import express from "express";
import pino from "pino-http";
import cors from "cors";
import env from "./utils/env.js"
import contactsRouter from './routers/contacts.js'
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
const PORT = env("PORT", "3000");

const setupServer = () => {
    const app = express();
    const logger = pino({
        transport: {
            target: "pino-pretty"
        }
    });

    app.use(logger);
    app.use(cors());// дозволяє обмінюватися інформацією між веб-ресурсами з різних доменів.
    app.use(express.json());
    
app.get("/", (req, res) => {
    res.json({
        status: 200,
        message: 'Hello world!'
    });
});

    app.use(contactsRouter);
    
    app.use('*', notFoundHandler);

    app.use(errorHandler);

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};
export default setupServer;