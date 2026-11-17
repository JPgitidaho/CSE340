
import {
    getOrganizationDetails,
    createOrganization
} from '../models/organizations.js';

import {
    getProjectsByOrganization
} from '../models/projects.js';

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
        const { name, description, contactEmail } = req.body;

        const logoFilename = 'placeholder-logo.png';

        const organizationId = await createOrganization(
            name,
            description,
            contactEmail,
            logoFilename
        );

        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        next(error);
    }
};

export {
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm
};
