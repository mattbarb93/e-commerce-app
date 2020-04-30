const express = require('express');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();


router.get('/signup', (req, res) => {

    //Adding method="POST". Its associated with creating a record of some kind, like an user account!
    res.send(signupTemplate({req}));
});



router.post('/signup', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    //Input validation
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send('Email in use');
    }

    if (password !== passwordConfirmation) {
        return res.send('Passwords must match!')
    }

    // Create a user in our user repo to represent this person

    const user = await usersRepo.create({ email, password });

    //Store the ID of that user inside the user's cookies
    req.session.userId = user.id //Added by Cookie Session!


    res.send('Account created!');
});

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out!')
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate());
});

router.post('/signin', async (req,res) => {
    const {email, password} = req.body;

    const user = await usersRepo.getOneBy({email})

    if(!user) {
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