
import express from 'express';

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
} from './controllers/projects.js';

import {
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from './controllers/organizations.js';

import {
    showAssignCategoriesForm,
    processAssignCategories
} from './controllers/projectCategories.js';

import categoryManagementRouter from './categoryManagementRoutes.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage
} from './controllers/categories.js';

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard
} from './controllers/users.js';

const router = express.Router();

router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

router.get('/dashboard', requireLogin, showDashboard);

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

router.get('/new-project', requireLogin, showNewProjectForm);

router.post(
    '/new-project',
    requireLogin,
    projectValidation,
    processNewProjectForm
);

router.get(
    '/edit-project/:id',
    requireLogin,
    showEditProjectForm
);

router.post(
    '/edit-project/:id',
    requireLogin,
    projectValidation,
    processEditProjectForm
);

router.get(
    '/project/:id/categories',
    requireLogin,
    showAssignCategoriesForm
);

router.post(
    '/project/:id/categories',
    requireLogin,
    processAssignCategories
);

router.get(
    '/new-organization',
    requireLogin,
    showNewOrganizationForm
);

router.post(
    '/new-organization',
    requireLogin,
    organizationValidation,
    processNewOrganizationForm
);

router.get(
    '/edit-organization/:id',
    requireLogin,
    showEditOrganizationForm
);

router.post(
    '/edit-organization/:id',
    requireLogin,
    organizationValidation,
    processEditOrganizationForm
);

router.get('/organization/:id', showOrganizationDetailsPage);

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

router.use(requireLogin, categoryManagementRouter);

export default router;
