
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

const syncProjectCategories = async (projectId, categoryIds) => {
    const query = `
        WITH removed AS (
            DELETE FROM public.project_category
            WHERE project_id = $1
                AND NOT (category_id = ANY($2::integer[]))
            RETURNING category_id
        ),
        added AS (
            INSERT INTO public.project_category
                (project_id, category_id)
            SELECT
                $1,
                category_id
            FROM public.category
            WHERE category_id = ANY($2::integer[])
            ON CONFLICT (project_id, category_id)
            DO NOTHING
            RETURNING category_id
        )
        SELECT
            (SELECT COUNT(*)::integer FROM added) AS added_count,
            (SELECT COUNT(*)::integer FROM removed) AS removed_count;
    `;

    const result = await db.query(query, [
        projectId,
        categoryIds
    ]);

    return result.rows[0];
};

export {
    getAllCategories,
    getProjectCategories,
    addProjectCategories,
    syncProjectCategories
};
