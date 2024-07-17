import Contact from "../db/models/Contact.js";
import calcPaginationData from "../utils/calcPaginationData.js";
import {contactFieldList} from '../constants/contacts-constants.js';
import { sortOrderList } from '../constants/index.js';

export const getAllContacts = async ({ filter, page, perPage, sortBy = contactFieldList[0], sortOrder = sortOrderList[0] }) => {
    const skip = (page - 1) * perPage;
    const databaseQuery = Contact.find();
    if (filter.userId) {
        databaseQuery.where('userId').equals(filter.userId);
    }
    if (filter.contactType) {
        databaseQuery.where('contactType').equals(filter.contactType)
    }
    if (filter.isFavourite) {
        databaseQuery.where('isFavourite').equals(filter.isFavourite)
    }
    // const items = await databaseQuery.skip(skip).limit(perPage).sort({ [sortBy]: sortOrder }).exec();
    // const totalItems = await Contact.find().merge(databaseQuery).countDocuments();

    const [totalItems, items] = await Promise.all([
        Contact.find().merge(databaseQuery).countDocuments(), databaseQuery.skip(skip).limit(perPage).sort({ [sortBy]: sortOrder }).exec(),
    ]);
    const { totalPages, hasNextPage, hasPreviousPage } = calcPaginationData({ total: totalItems, page, perPage });
   
    return {
        items,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage,
        hasNextPage
    }
};

export const getContactById = filter => Contact.findOne(filter);

export const addContact = contactId => Contact.create(contactId);

export const patchContact = async (contactId, payload, options = {}) => {
    const rawResult = await Contact.findOneAndUpdate({ _id: contactId,  userId: userId }, payload, {
        includeResultMetadata: true,
        ...options,
    });
    if (!rawResult || !rawResult.value) return null;
    return {
        contact: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted)
    };
};

export const deleteContact = async (contactId) => {
    const contact = await Contact.findOneAndDelete({ _id: contactId,  userId: userId });
    return contact;
};