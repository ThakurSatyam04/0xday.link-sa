import {Router} from 'express';
import { sendOTPController, validateOTPController } from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/send-otp', sendOTPController);
authRouter.post('/verify-otp', validateOTPController);

export default authRouter;