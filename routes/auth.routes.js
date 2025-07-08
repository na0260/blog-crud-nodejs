import express from 'express';
import * as AuthController from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/login', AuthController.login);
router.post('/login', AuthController.authenticate);
router.get('/logout', AuthController.logout);

export default router;