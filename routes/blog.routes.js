import express from 'express';
import * as BlogController from '../controllers/blog.controller.js';
import {body} from 'express-validator';

const router = express.Router();

router.get('/list', BlogController.index);
router.get('/create', BlogController.create);
router.post('/store', [
        body('title').notEmpty().withMessage('Title is required'),
        body('description').notEmpty().withMessage('Description is required'),
    ],
    BlogController.store
);

export default router;