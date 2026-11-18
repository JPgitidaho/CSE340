
import { body, validationResult } from 'express-validator';

import {
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
} from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .bail()
        .isLength({ min: 3, max: 150 })
        .withMessage('Title must be between 3 and 150 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .bail()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),

    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .bail()
        .isLength({ max: 200 })
        .withMessage('Location cannot exceed 200 characters'),

    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .bail()
        .isISO8601({ strict: true })
        .withMessage('Date must be a valid date'),

    body('organizationId')
        .notEmpty()
        .withMessage('Organization is required')
        .bail()
        .isInt({ min: 1 })
        .withMessage('Organization must be valid')
];

const showProjectsPage = async (req, res, next) => {
    try {
        const [projects, allProjects] = await Promise.all([
            getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS),
            getAllProjects()
        ]);

        const upcomingIds = new Set(
            projects.map(project => project.project_id)
        );

        const otherProjects = allProjects
            .filter(project => !upcomingIds.has(project.project_id))
            .reverse();

        res.render('projects', {
            title: 'Upcoming Service Projects',
            projects,
            otherProjects
        });
    } catch (error) {
        next(error);
    }
};

const showProjectDetailsPage = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(404).send('Project not found.');
        }

        const project = await getProjectDetails(id);

        if (!project) {
            return res.status(404).send('Project not found.');
        }

        res.render('project', {
            title: project.title,
            project
        });
    } catch (error) {
        next(error);
    }
};

const showNewProjectForm = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();

        res.render('new-project', {
            title: 'Add New Service Project',
            organizations
        });
    } catch (error) {
        next(error);
    }
};

const processNewProjectForm = async (req, res, next) => {
    try {
        const results = validationResult(req);

        if (!results.isEmpty()) {
            results.array().forEach(error => {
                req.flash('error', error.msg);
            });

            return res.redirect('/new-project');
        }

        const {
            title,
            description,
            location,
            date,
            organizationId
        } = req.body;

        await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash(
            'success',
            'New service project created successfully!'
        );

        return res.redirect('/projects');
    } catch (error) {
        next(error);
    }
};

const showEditProjectForm = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(404).send('Project not found.');
        }

        const project = await getProjectDetails(id);

        if (!project) {
            return res.status(404).send('Project not found.');
        }

        const organizations = await getAllOrganizations();

        res.render('edit-project', {
            title: 'Edit Service Project',
            project,
            organizations
        });
    } catch (error) {
        next(error);
    }
};

const processEditProjectForm = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(404).send('Project not found.');
        }

        const results = validationResult(req);

        if (!results.isEmpty()) {
            results.array().forEach(error => {
                req.flash('error', error.msg);
            });

            return res.redirect(`/edit-project/${id}`);
        }

        const {
            title,
            description,
            location,
            date,
            organizationId
        } = req.body;

        const updatedProject = await updateProject(
            id,
            title,
            description,
            location,
            date,
            organizationId
        );

        if (!updatedProject) {
            return res.status(404).send('Project not found.');
        }

        req.flash(
            'success',
            'Service project updated successfully!'
        );

        return res.redirect(`/project/${id}`);
    } catch (error) {
        next(error);
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
};
