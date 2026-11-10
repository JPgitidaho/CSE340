
import { getOrganizationDetails } from '../models/organizations.js';

const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const organization = await getOrganizationDetails(id);

        if (!organization) {
            return res.status(404).send('Organization not found.');
        }

        res.render('organization', {
            title: organization.name,
            organization
        });
    } catch (error) {
        next(error);
    }
};

export { showOrganizationDetailsPage };
