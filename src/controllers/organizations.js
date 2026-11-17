
import { body, validationResult } from 'express-validator';

import {
    getOrganizationDetails,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';

import {
    getProjectsByOrganization
} from '../models/projects.js';

const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters')
        .escape(),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters')
        .escape(),

    body('contactEmail')
        .trim()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
];

const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const organization = await getOrganizationDetails(id);

        if (!organization) {
            return res.status(404).send('Organization not found.');
        }

        const projects = await getProjectsByOrganization(id);

        res.render('organization', {
            title: organization.name,
            organization,
            projects
        });
    } catch (error) {
        next(error);
    }
};

const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
};

const processNewOrganizationForm = async (req, res, next) => {
    try {
        const results = validationResult(req);

        if (!results.isEmpty()) {
            results.array().forEach(error => {
                req.flash('error', error.msg);
            });

            return res.redirect('/new-organization');
        }

        const { name, description, contactEmail } = req.body;
        const logoFilename = 'placeholder-logo.png';

        const organizationId = await createOrganization(
            name,
            description,
            contactEmail,
            logoFilename
        );

        req.flash('success', 'Organization added successfully!');

        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        next(error);
    }
};

const showEditOrganizationForm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const organizationDetails = await getOrganizationDetails(id);

        if (!organizationDetails) {
            return res.status(404).send('Organization not found.');
        }

        res.render('edit-organization', {
            title: 'Edit Organization',
            organizationDetails
        });
    } catch (error) {
        next(error);
    }
};

const processEditOrganizationForm = async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = validationResult(req);

        if (!results.isEmpty()) {
            results.array().forEach(error => {
                req.flash('error', error.msg);
            });

            return res.redirect(`/edit-organization/${id}`);
        }

        const {
            name,
            description,
            contactEmail,
            logoFilename
        } = req.body;

        await updateOrganization(
            id,
            name,
            description,
            contactEmail,
            logoFilename
        );

        req.flash('success', 'Organization updated successfully!');

        res.redirect(`/organization/${id}`);
    } catch (error) {
        next(error);
    }
};

export {
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
};
