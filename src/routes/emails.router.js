import { Router } from "express";
import { sendEmailToResetPassword, resetPassword } from '../daos/EmailManager.js';

const router = Router();

router.post("/send-email-to-reset", sendEmailToResetPassword);
// router.get('/reset-password/:token', resetPassword)



export default router;