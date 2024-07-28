import createHttpError from "http-errors";
import { addContact, deleteContact, getAllContacts, getContactById, patchContact } from "../services/contacts.js";
import parsePaginationParams from "../utils/parsePaginationParams.js";
import parseSortParams from "../utils/parseSortParams.js";
import { contactFieldList } from "../constants/contacts-constants.js";
import parseContactFilterParams from "../utils/parseContactFilterParams.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import env from "../utils/env.js";

export const getContactsController = async (req, res) => {
    const { _id: userId } = req.user;
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query, contactFieldList);
    const filter = { ...parseContactFilterParams(req.query), userId };
    const contact = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
    });
        
    res.status(200).json({
        status: 200,
        message: "Successfully found contacts!",
        data: contact,
      
    })
};

export const getContactByIdController = async (req, res, next) => {
    const { _id: userId } = req.user;
    const { contactId } = req.params;
        
        const contact = await getContactById({ _id: contactId, userId });
        
        if (!contact) {
            next(createHttpError(404, 'Contact not found'));
            return;
        };

        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        }); 
};

export const addContactController = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const photo = req.file;
        let photoUrl;
        if (photo) {
            if (env('ENABLE_CLOUDINARY') === 'true') {
                photoUrl = await saveFileToCloudinary(photo);
            } else {
                photoUrl = await saveFileToUploadDir(photo);
            }
        }

        const result= await addContact({
            ...req.body,
            userId,
            photo: photoUrl
        });

        res.status(201).json({
            status: 201,
            message: "Successfully created a contact!",
            data: result,
        })
    } catch (error) {
        next(error)
    }
};

export const patchContactController = async (req, res, next) => {
    try {
        const { contactId} = req.params;
        const { _id: userId } = req.user;
        const photo = req.file;

        let photoUrl;

        if (photo) {
            if (env('ENABLE_CLOUDINARY') === 'true') {
                photoUrl = await saveFileToCloudinary(photo);
            } else {
                photoUrl = await saveFileToUploadDir(photo);
            }
        }
        // const updatePayload = {
        //     ...req.body,
        //     photoUrl
        // };
        const updatePayload = { ...req.body };
        if (photoUrl) {
            updatePayload.photo = photoUrl;
        }
    
        const result = await patchContact(contactId, userId, updatePayload);
        
        if (!result) {
            next(createHttpError(404, 'Contact not found'));
            return;
        }
        res.json({
            status: 200,
            message: "Successfully patched a contact!",
            data: result.contact,
        });

    } catch (error) {
        next(error);
    }
};

export const deleteContactController = async (req, res, next) => {
    const { contactId } = req.params;
        const { _id: userId } = req.user;

    const contact = await deleteContact({ _id: contactId, userId });
    if (!contact) {
        next(createHttpError(404, 'Contact not found'));
        return;
    };
    res.status(204).send()
};
