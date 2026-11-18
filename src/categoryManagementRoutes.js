
import express from 'express';

import {
    categoryValidation,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
} from './controllers/categoryManagement.js';

const router = express.Router();

router.get('/new-category', showNewCategoryForm);

router.post(
    '/new-category',
    categoryValidation,
    processNewCategoryForm
);

router.get('/edit-category/:id', showEditCategoryForm);

router.post(
    '/edit-category/:id',
    categoryValidation,
    processEditCategoryForm
);

export default router;
