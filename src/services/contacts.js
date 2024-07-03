import Contact from "../db/models/Contact.js";

export const getAllContacts = () => Contact.find();
;

export const getContactById = (contactId) => Contact.findById(contactId);