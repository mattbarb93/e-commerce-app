const express = require('express');


const {handleErrors} = require('./middleware')
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPasswordForUser } = require('./validators');


const router = express.Router();


router.get('/signup', (req, res) => {

    //Adding method="POST". Its associated with creating a record of some kind, like an user account!
    res.send(signupTemplate({ req }));
});



router.post(
    '/signup', 
    [requireEmail, requirePassword, requirePasswordConfirmation],
    handleErrors(signupTemplate),

    async (req, res) => {

        const { email, password } = req.body;


        const user = await usersRepo.create({ email, password });

        //Store the ID of that user inside the user's cookies
        req.session.userId = user.id;

        res.send('Account created!');
    });

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out!')
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate({}));
});

router.post(
    '/signin', 
    [requireEmailExists, requireValidPasswordForUser],
    handleErrors(signinTemplate),
    async (req, res) => {
    
        
    
    const { email } = req.body;

    const user = await usersRepo.getOneBy({ email });
    
    req.session.userId = user.id;

    res.send('You are signed in!');

});

//Export so the whole project can use it
module.exports = router;