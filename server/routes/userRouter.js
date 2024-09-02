import {Router} from 'express'
import { getUserDataController } from '../controllers/userController.js';

const userRouter = Router();

// this is to get get userdata based on the username passed in the params
userRouter.get('/:username', getUserDataController);

export default userRouter