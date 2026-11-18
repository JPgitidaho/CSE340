
import { getProjectDetails } from '../models/projects.js';

import {
    getAllCategories,
    getProjectCategories,
    addProjectCategories
} from '../models/projectCategories.js';

const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = Number(req.params.id);

        if (!Number.isSafeInteger(projectId) || projectId < 1) {
            return res.status(404).send('Project not found.');
        }

        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).send('Project not found.');
        }

        const [categories, assignedCategories] = await Promise.all([
            getAllCategories(),
            getProjectCategories(projectId)
        ]);

        const assignedCategoryIds = assignedCategories.map(
            category => category.category_id
        );

        res.render('project-categories', {
            title: 'Assign Project Categories',
            project,
            categories,
            assignedCategories,
            assignedCategoryIds
        });
    } catch (error) {
        next(error);
    }
};

const processAssignCategories = async (req, res, next) => {
    try {
        const projectId = Number(req.params.id);

        if (!Number.isSafeInteger(projectId) || projectId < 1) {
            return res.status(404).send('Project not found.');
        }

        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).send('Project not found.');
        }

        const selected = req.body.categoryIds;

        const values = Array.isArray(selected)
            ? selected
            : selected ? [selected] : [];

        if (
            values.length === 0 ||
            values.some(value => !/^\d+$/.test(String(value)))
        ) {
            req.flash('error', 'Select at least one valid category.');
            return res.redirect(`/project/${projectId}/categories`);
        }

        const categoryIds = [
            ...new Set(values.map(Number))
        ];

        const categories = await getAllCategories();

        const validCategoryIds = new Set(
            categories.map(category => category.category_id)
        );

        if (
            categoryIds.some(
                categoryId => !validCategoryIds.has(categoryId)
            )
        ) {
            req.flash('error', 'One or more categories are invalid.');
            return res.redirect(`/project/${projectId}/categories`);
        }

        const insertedCount = await addProjectCategories(
            projectId,
            categoryIds
        );

        if (insertedCount === 0) {
            req.flash('success', 'These categories are already assigned.');
        } else {
            req.flash('success', 'Project categories assigned successfully!');
        }

        return res.redirect(`/project/${projectId}/categories`);
    } catch (error) {
        next(error);
    }
};

export {
    showAssignCategoriesForm,
    processAssignCategories
};
