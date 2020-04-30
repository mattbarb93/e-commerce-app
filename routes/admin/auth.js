const express = require('express');
const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();


router.get('/signup', (req, res) => {

    //Adding method="POST". Its associated with creating a record of some kind, like an user account!
    res.send(signupTemplate({ req }));
});



router.post('/signup', [
    //https://www.npmjs.com/package/validator
    //Sanitize first, then validate
    //Trim checks for white spaces, normalizeEmail canonicalizes the email, isEmail validates to see if its an email
    check('email')
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
    check('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters'),
    check('passwordConfirmation')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters')
        .custom((passwordConfirmation, { req }) => {
            if(passwordConfirmation !== req.body.password) {
                throw new Error('Passwords must match')
            }
        })
        
], async (req, res) => {
    const errors = validationResult(req);
    console.log(errors);

    const { email, password, passwordConfirmation } = req.body;


    const user = await usersRepo.create({ email, password });

    //Store the ID of that user inside the user's cookies
    req.session.userId = user.id 

    res.send('Account created!');
});

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out!')
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({ email })

    if (!user) {
        return res.send('Email not found!');
    }

    const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
    );

    if (!validPassword) {
        return res.send('Incorrect password!')
    }

    req.session.userId = user.id;

    res.send('You are signed in!');

});

//Export so the whole project can use it
module.exports = router;