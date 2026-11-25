
import bcrypt from 'bcrypt';
import db from './db.js';

const createUser = async (name, email, passwordHash) => {
    const query = `
        INSERT INTO public.users (
            name,
            email,
            password_hash,
            role_id
        )
        SELECT $1, $2, $3, role_id
        FROM public.roles
        WHERE role_name = 'user'
        RETURNING user_id;
    `;

    const result = await db.query(query, [
        name,
        email,
        passwordHash
    ]);

    if (result.rows.length === 0) {
        throw new Error('User role not found.');
    }

    return result.rows[0].user_id;
};


const findUserByEmail = async (email) => {
    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            u.password_hash,
            r.role_name
        FROM public.users AS u
        JOIN public.roles AS r
            ON u.role_id = r.role_id
        WHERE u.email = $1;
    `;

    const result = await db.query(query, [email]);

    return result.rows[0] ?? null;
};


const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const isValid = await verifyPassword(
        password,
        user.password_hash
    );

    if (!isValid) {
        return null;
    }

    const {
        password_hash,
        ...authenticatedUser
    } = user;

    return authenticatedUser;
};

const getAllUsers = async () => {
    const query = `
        SELECT
            u.user_id,
            u.name,
            u.email,
            COALESCE(r.role_name, 'unassigned') AS role_name
        FROM public.users AS u
        LEFT JOIN public.roles AS r
            ON u.role_id = r.role_id
        ORDER BY u.name ASC, u.user_id ASC;
    `;

    const result = await db.query(query);

    return result.rows;
};


export {
    createUser,
    authenticateUser,
    getAllUsers
};
