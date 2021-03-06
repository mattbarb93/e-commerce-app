const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');


//https://www.npmjs.com/package/validator
//Sanitize first, then validate
//Trim checks for white spaces, normalizeEmail canonicalizes the email, isEmail validates to see if its an email
module.exports = {

    requireTitle:  check('title')
    .trim()
    .isLength({min: 5, max: 20})
    .withMessage('Must be between 5 to 20 characters'),

    requirePrice: check('price')
    .trim()
    .toFloat()
    .isFloat( {min: 1})
    .withMessage('Must be a number over 1!'),

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
            } else {
                return true;
            }
        }),
    requireEmailExists: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .custom(async (email) => {
        const user = await usersRepo.getOneBy({ email });
        if (!user) {
            throw new Error('Email not found!');
        }
    }),
    requireValidPasswordForUser: check('password')
    .trim()
    .custom(async (password, { req }) => {
        const user = await usersRepo.getOneBy({ email: req.body.email })
    
        if (!user) {
            throw new Error('Invalid password');
        }
    
        const validPassword = await usersRepo.comparePasswords(
            user.password,
            password
        );
    
        if (!validPassword) {
            throw new Error('Incorrect password!');
        }
    
    }),
    requireImage: check('image')
    .custom(async (image, {req}) => {
        const file = req.file;

        if(!file){
            throw new Error('Please upload a file!')
        }

        return (req, res, next) => {
            next()
        }
    })
}
