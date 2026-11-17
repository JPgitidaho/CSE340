
import express from 'express';

import {
    showProjectsPage,
    showProjectDetailsPage
} from './controllers/projects.js';

import {
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from './controllers/organizations.js';

const router = express.Router();

router.get('/projects', showProjectsPage);

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

export default router;
