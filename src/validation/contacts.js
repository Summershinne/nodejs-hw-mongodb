import Joi from 'joi';
import { typeList } from '../constants/contacts-constants.js';

export const createContactsSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        'string.base': 'Name should be a string',
        'string.min': 'Name should have at least {#limit} characters',
        'string.max': 'Name should have at most {#limit} characters',
        'any.required': 'Name is required',
    }),
    phoneNumber: Joi.string().min(3).max(20).required(),
    email: Joi.string().min(3).max(20).required(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...typeList).required(),
});

export const updateContactsSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().min(3).max(20),
    email: Joi.string().min(3).max(20),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...typeList),
});
