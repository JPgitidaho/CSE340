import { getProjectDetails } from '../models/projects.js';
import {
    getAllCategories,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments
} from '../models/categories.js';

const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const [projectDetails, categories, assignedCategories] = await Promise.all([
            getProjectDetails(projectId),
            getAllCategories(),
            getCategoriesByServiceProjectId(projectId)
        ]);

        if (!projectDetails) {
            return res.status(404).send('Project not found.');
        }

        res.render('assign-categories', {
            title: 'Assign Categories to Project',
            projectId,
            projectDetails,
            categories,
            assignedCategories
        });
    } catch (error) {
        next(error);
    }
};

const processAssignCategoriesForm = async (req, res, next) => {
    const { projectId } = req.params;

    try {
        const project = await getProjectDetails(projectId);

        if (!project) {
            return res.status(404).send('Project not found.');
        }

        const selected = req.body.categoryIds || [];
        const requestedIds = Array.isArray(selected) ? selected : [selected];
        const categoryIds = [...new Set(requestedIds.map(Number))];
        const allCategories = await getAllCategories();
        const validIds = new Set(allCategories.map(category => Number(category.category_id)));

        if (categoryIds.some(id => !Number.isInteger(id) || !validIds.has(id))) {
            req.flash('error', 'Please select valid categories.');
            return res.redirect(`/assign-categories/${projectId}`);
        }

        await updateCategoryAssignments(projectId, categoryIds);
        req.flash('success', 'Categories updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

export {
    showAssignCategoriesForm,
    processAssignCategoriesForm
};
