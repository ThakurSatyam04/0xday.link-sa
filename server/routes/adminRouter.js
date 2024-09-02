import {Router} from 'express'
import { adminPageController, updateUserController, userDataSubmitController } from '../controllers/adminController.js';

import authenticateToken from '../middlewares/protectAdminRoute.js';
import configureMulter from '../utils/multer.js';

let upload = configureMulter();

const adminRouter = Router()

adminRouter.use(authenticateToken)

adminRouter.get('/', adminPageController)
adminRouter.post('/add-user', userDataSubmitController);
adminRouter.put('/update-user/:username',updateUserController)

export default adminRouter;