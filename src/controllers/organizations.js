
import { getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganization } from '../models/projects.js';

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

export { showOrganizationDetailsPage };
