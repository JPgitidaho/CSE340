
import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM public.category
        ORDER BY name;
    `;

    const result = await db.query(query);
    return result.rows;
};

const getProjectCategories = async (projectId) => {
    const query = `
        SELECT
            c.category_id,
            c.name
        FROM public.category AS c
        INNER JOIN public.project_category AS pc
            ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;

    const result = await db.query(query, [projectId]);
    return result.rows;
};

const addProjectCategories = async (projectId, categoryIds) => {
    const query = `
        INSERT INTO public.project_category
            (project_id, category_id)
        SELECT
            $1,
            category_id
        FROM public.category
        WHERE category_id = ANY($2::integer[])
        ON CONFLICT (project_id, category_id)
        DO NOTHING;
    `;

    const result = await db.query(query, [
        projectId,
        categoryIds
    ]);

    return result.rowCount;
};

export {
    getAllCategories,
    getProjectCategories,
    addProjectCategories
};
