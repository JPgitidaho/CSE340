
import bcrypt from 'bcrypt';

import {
    createUser,
    authenticateUser,
    getAllUsers
} from '../models/users.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', {
        title: 'Register'
    });
};

const processUserRegistrationForm = async (req, res, next) => {
    try {
        const name = typeof req.body.name === 'string'
            ? req.body.name.trim()
            : '';

        const email = typeof req.body.email === 'string'
            ? req.body.email.trim().toLowerCase()
            : '';

        const password = req.body.password;

        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (
            name.length < 3 ||
            name.length > 100 ||
            email.length > 100 ||
            !validEmail ||
            typeof password !== 'string' ||
            password.length < 8 ||
            Buffer.byteLength(password, 'utf8') > 72
        ) {
            req.flash(
                'error',
                'Please enter a valid name, email, and password of at least 8 characters.'
            );

            return res.redirect('/register');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await createUser(name, email, passwordHash);

        req.flash('success', 'Account created successfully!');
        return res.redirect('/register');

    } catch (error) {
        if (error.code === '23505') {
            req.flash('error', 'This email is already registered.');
            return res.redirect('/register');
        }

        next(error);
    }
};

const showLoginForm = (req, res) => {
    if (req.query.loggedOut === '1') {
        req.flash('success', 'You have logged out successfully!');
        return res.redirect('/login');
    }

    return res.render('login', {
        title: 'Login'
    });
};

const processLoginForm = async (req, res, next) => {
    try {
        const email = typeof req.body.email === 'string'
            ? req.body.email.trim().toLowerCase()
            : '';

        const password = req.body.password;

        if (!email || typeof password !== 'string') {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        req.session.regenerate(error => {
            if (error) {
                return next(error);
            }

            req.session.user = user;

            req.flash('success', 'You have logged in successfully!');

            console.log('User logged in:', user.user_id);

            req.session.save(error => {
                if (error) {
                    return next(error);
                }

                return res.redirect('/dashboard');
            });
        });

    } catch (error) {
        next(error);
    }
};

const processLogout = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            return next(error);
        }

        res.clearCookie('connect.sid');

        return res.redirect('/login?loggedOut=1');
    });
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }

    next();
};

const showDashboard = (req, res) => {
    const user = req.session.user;


    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session?.user) {
            req.flash(
                'error',
                'You must be logged in to access that page.'
            );

            return res.redirect('/login');
        }

        if (req.session.user.role_name !== role) {
            req.flash(
                'error',
                'You do not have permission to access that page.'
            );

            return res.redirect('/dashboard');
        }

        next();
    };
};

const showUsersPage = async (req, res, next) => {
    try {
        const users = await getAllUsers();

        return res.render('users', {
            title: 'Registered Users',
            users
        });
    } catch (error) {
        next(error);
    }
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage
};
