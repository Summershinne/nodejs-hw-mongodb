import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { addContactController, deleteContactController, getContactByIdController, getContactsController, patchContactController } from '../controllers/contacts.js';
import isValidId from '../middlewares/isValidId.js';
import validateBody from '../utils/validateBody.js';
import { createContactsSchema, updateContactsSchema } from '../validation/contacts.js';
import authenticate from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdController));

contactsRouter.post('/contacts', upload.single('photo'),validateBody(createContactsSchema), ctrlWrapper(addContactController));

contactsRouter.patch('/contacts/:contactId', upload.single('photo'), isValidId,
validateBody(updateContactsSchema), ctrlWrapper(patchContactController));

contactsRouter.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter; 