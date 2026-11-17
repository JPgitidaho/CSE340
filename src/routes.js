
import express from 'express';

import {
    showProjectsPage,
    showProjectDetailsPage
} from './controllers/projects.js';

import {
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm
} from './controllers/organizations.js';

const router = express.Router();

router.get('/projects', showProjectsPage);

router.get('/project/:id', showProjectDetailsPage);

router.get('/new-organization', showNewOrganizationForm);

router.post('/new-organization', processNewOrganizationForm);

router.get('/organization/:id', showOrganizationDetailsPage);

export default router;
