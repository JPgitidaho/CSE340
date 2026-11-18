
import { body, validationResult } from 'express-validator';

import {
    getCategoryById,
    createCategory,
    updateCategory
} from '../models/categoryManagement.js';

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

const showNewCategoryForm = (req, res) => {
    res.render('new-category', {
        title: 'Add New Category'
    });
};

const processNewCategoryForm = async (req, res, next) => {
    try {
        const results = validationResult(req);

        if (!results.isEmpty()) {
            results.array().forEach(error => {
                req.flash('error', error.msg);
            });

            return res.redirect('/new-category');
        }

        const categoryId = await createCategory(req.body.name);

        req.flash('success', 'Category created successfully!');

        return res.redirect(`/edit-category/${categoryId}`);
    } catch (error) {
        if (error.code === '23505') {
            req.flash('error', 'A category with this name already exists.');
            return res.redirect('/new-category');
        }

        next(error);
    }
};

const showEditCategoryForm = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
            return res.status(404).send('Category not found.');
        }

        const category = await getCategoryById(id);

        if (!category) {
            return res.status(404).send('Category not found.');
        }

        return res.render('edit-category', {
            title: 'Edit Category',
            category
        });
    } catch (error) {
        next(error);
    }
};

const processEditCategoryForm = async (req, res, next) => {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
        return res.status(404).send('Category not found.');
    }

    try {
        const results = validationResult(req);

        if (!results.isEmpty()) {
            results.array().forEach(error => {
                req.flash('error', error.msg);
            });

            return res.redirect(`/edit-category/${id}`);
        }

        const updatedCategory = await updateCategory(
            id,
            req.body.name
        );

        if (!updatedCategory) {
            return res.status(404).send('Category not found.');
        }

        req.flash('success', 'Category updated successfully!');

        return res.redirect(`/edit-category/${id}`);
    } catch (error) {
        if (error.code === '23505') {
            req.flash('error', 'A category with this name already exists.');
            return res.redirect(`/edit-category/${id}`);
        }

        next(error);
    }
};

export {
    categoryValidation,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
};
