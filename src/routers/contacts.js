import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { addContactController, deleteContactController, getContactByIdConntroller, getContactsController, patchContactController } from '../controllers/contacts.js';
import isValidId from '../middlewares/isValidId.js';
import validateBody from '../utils/validateBoody.js';
import { createContactsSchema, updateContactsSchema } from '../validation/contacts.js';
import authenticate from '../middlewares/authenticate.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdConntroller));

contactsRouter.post('/contacts', validateBody(createContactsSchema), ctrlWrapper(addContactController));

contactsRouter.patch('/contacts/:contactId', isValidId,
validateBody(updateContactsSchema), ctrlWrapper(patchContactController));

contactsRouter.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter; 