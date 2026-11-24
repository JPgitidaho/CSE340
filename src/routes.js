
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

router.get('/new-project', showNewProjectForm);

router.post(
    '/new-project',
    projectValidation,
    processNewProjectForm
);

router.get('/edit-project/:id', showEditProjectForm);

router.post(
    '/edit-project/:id',
    projectValidation,
    processEditProjectForm
);

router.get('/project/:id/categories', showAssignCategoriesForm);

router.post('/project/:id/categories', processAssignCategories);

router.get('/project/:id', showProjectDetailsPage);

router.get('/new-organization', showNewOrganizationForm);

router.post(
    '/new-organization',
    organizationValidation,
    processNewOrganizationForm
);

router.get('/edit-organization/:id', showEditOrganizationForm);

router.post(
    '/edit-organization/:id',
    organizationValidation,
    processEditOrganizationForm
);

router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

router.use(categoryManagementRouter);

export default router;
