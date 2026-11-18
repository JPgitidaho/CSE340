
import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT
            p.project_id,
            p.organization_id,
            p.title,
            p.description,
            p.location,
            p.date,
            o.name AS organization_name
        FROM public.project AS p
        INNER JOIN public.organization AS o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_id;
    `;

    const result = await db.query(query);
    return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM public.project AS p
        INNER JOIN public.organization AS o
            ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC, p.project_id ASC
        LIMIT $1;
    `;

    const result = await db.query(query, [number_of_projects]);
    return result.rows;
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM public.project AS p
        INNER JOIN public.organization AS o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0] ?? null;
};

const getProjectsByOrganization = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            title,
            date,
            location
        FROM public.project
        WHERE organization_id = $1
        ORDER BY date ASC, project_id ASC;
    `;

    const result = await db.query(query, [organizationId]);
    return result.rows;
};

const createProject = async (
    title,
    description,
    location,
    date,
    organizationId
) => {
    const query = `
        INSERT INTO public.project
            (title, description, location, date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const result = await db.query(query, [
        title,
        description,
        location,
        date,
        organizationId
    ]);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    return result.rows[0].project_id;
};

const updateProject = async (
    id,
    title,
    description,
    location,
    date,
    organizationId
) => {
    const query = `
        UPDATE public.project
        SET
            title = $1,
            description = $2,
            location = $3,
            date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const result = await db.query(query, [
        title,
        description,
        location,
        date,
        organizationId,
        id
    ]);

    return result.rows[0] ?? null;
};

export {
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails,
    getProjectsByOrganization,
    createProject,
    updateProject
};
