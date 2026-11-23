
import { getProjectDetails } from '../models/projects.js';

import {
    getAllCategories,
    getProjectCategories,
    syncProjectCategories
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
            title: 'Manage Project Categories',
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
            values.some(value =>
                !/^[1-9]\d*$/.test(String(value)) ||
                !Number.isSafeInteger(Number(value))
            )
        ) {
            req.flash('error', 'One or more categories are invalid.');
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

        const result = await syncProjectCategories(
            projectId,
            categoryIds
        );

        if (result.added_count === 0 && result.removed_count === 0) {
            req.flash('success', 'No changes were needed.');
        } else {
            req.flash('success', 'Project categories updated successfully!');
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
