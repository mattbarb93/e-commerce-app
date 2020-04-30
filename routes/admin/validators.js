const { check } = require('express-validator');
const usersRepo = require('../../repositories');

//https://www.npmjs.com/package/validator
//Sanitize first, then validate
//Trim checks for white spaces, normalizeEmail canonicalizes the email, isEmail validates to see if its an email
module.exports = {

    requireEmail: check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Must be a valid email')
        .custom(async (email) => {
            //Input validation
            const existingUser = await usersRepo.getOneBy({ email });
            if (existingUser) {
                throw new Error('Email in use!');
            }
        }),
    requirePassword: check('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters'),
    requirePasswordConfirmation: check('passwordConfirmation')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
        .custom((passwordConfirmation, { req }) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error('Passwords must match')
            }
        })
}
