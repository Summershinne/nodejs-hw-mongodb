import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { addContactController, deleteContactController, getContactByIdConntroller, getContactsController, patchContactController } from '../controllers/contacts.js';
import isValidId from '../middlewares/isValidId.js';

const contactsRouter = Router();

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdConntroller));

contactsRouter.post('/contacts', ctrlWrapper(addContactController));

contactsRouter.patch('/contacts/:contactId', isValidId, ctrlWrapper(patchContactController));

contactsRouter.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter;