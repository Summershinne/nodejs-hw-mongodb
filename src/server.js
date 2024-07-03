import express from "express";
import pino from "pino-http";
import cors from "cors";
import env from "./utils/env.js"
import { getContactById , getAllContacts} from "./services/contacts.js";

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

    app.get("/", (req, res) => {
        res.json({
            status: 200,
            message: 'Hello world!'
        });
    });

    app.get('/contacts', async (req, res) => {
        const contact = await getAllContacts();
        
        res.status(200).json({
            status: 200,
            data: contact,
            message: "Successfully found contacts!"
        })
    });

    app.get('/contacts/:contactId', async (req, res) => {
       try {
        const { contactId } = req.params;
        
        const contact = await getContactById(contactId);
        
        if (!contact) {
            return res.status(404).json({
                status: 404,
                message: 'Student not found'
            });
        };

 res.status(200).json({
            status: 200,
            data: contact,
            message: `Successfully found contact with id ${contactId}!`,
        });

       } catch (error) {
           if (error.message.includes('Cast to ObjectId failed')) {
               error.status = 404;
           }
           const { status = 500 } = error;
           res.status(status).json({
            message: error.message
        })
       }
        
    });

    app.use('*', (req, res) => {
        res.status(404).json({
            status:404,
            message: 'Not found'
        })
    });

    app.use((e, req, res) => {
        res.status(500).json({
            status: 500,
            message: 'Something went wrong',
            error: e.message
        })
    });

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};
export default setupServer;