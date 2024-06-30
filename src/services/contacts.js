import Contact from "../db/models/Contact.js";

export const getAllContacts = async () => {
    const contacts = await Contact.find();
    return contacts;
};

export const getContactById = async (contactId) => {
    const contact = await Contact.findById(contactId);
    return contact;
};