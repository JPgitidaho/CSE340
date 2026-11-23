
import {
    getAllCategories,
    getProjectsByCategoryId
} from '../models/categories.js';

import { getCategoryById } from '../models/categoryManagement.js';
import { getProjectCategories } from '../models/projectCategories.js';

const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();

        res.render('categories', {
            title: 'Service Project Categories',
            categories
        });
    } catch (error) {
        next(error);
    }
};

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
            return res.status(404).send('Category not found.');
        }

        const category = await getCategoryById(id);

        if (!category) {
            return res.status(404).send('Category not found.');
        }

        const projects = await getProjectsByCategoryId(id);

        const projectsWithCategories = await Promise.all(
            projects.map(async project => ({
                ...project,
                categories: await getProjectCategories(project.project_id)
            }))
        );

        res.render('category', {
            title: category.name,
            category,
            projects: projectsWithCategories
        });
    } catch (error) {
        next(error);
    }
};

export {
    showCategoriesPage,
    showCategoryDetailsPage
};
