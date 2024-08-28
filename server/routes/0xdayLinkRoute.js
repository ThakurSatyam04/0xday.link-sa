import {Router} from 'express'

import {adminPageController, sendOTPController,validateOTPController,userDataSubmitController, getUserDataController,updateUserController} from '../controllers/0xdayLinkController.js'
import authenticateToken from '../middlewares/protectAdminRoute.js';
import configureMulter from '../utils/multer.js';

let upload = configureMulter();

const router = Router();

router.post('/send-otp', sendOTPController);
router.post('/verify-otp', validateOTPController);
router.get('/admin', authenticateToken, adminPageController)
router.post('/add-user', userDataSubmitController);
router.put('/update-user/:username', updateUserController)
router.get('/user/:username', getUserDataController);


export default router;


