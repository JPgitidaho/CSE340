
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

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM public.project_category AS pc
        INNER JOIN public.project AS p
            ON pc.project_id = p.project_id
        INNER JOIN public.organization AS o
            ON p.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY p.date ASC, p.project_id ASC;
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows;
};

export {
    getAllCategories,
    getProjectsByCategoryId
};
