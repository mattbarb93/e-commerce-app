const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

const app = express();

//Syntax for bodyParser.urlencoded: used specifically to handle an HTML form. Will take the information from the user, parse it, and send it to our server. Set it like this so its done globally
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['nqoidnqpiwdnqpdqwpo'] //Used to encrypt the user's cookie since it's a random string
}));


app.get('/signup', (req, res) => {

    //Adding method="POST". Its associated with creating a record of some kind, like an user account!
    res.send(`
    <div>
        Your id is: ${req.session.userId}
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordConfirmation" placeholder="password confirmation" />
            <button>Sign Up</button>
        </form>
    </div>
    
    `);
});



app.post('/signup', async (req, res) => {
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

app.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out!')
});

app.get('/signin', (req, res) => {
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <button>Sign In</button>
        </form>
    </div>
    `)
});

app.post('/signin', async (req,res) => {
    const {email, password} = req.body;

    const user = await usersRepo.getOneBy({email})

    if(!user) {
        return res.send('Email not found!');
    }

    if (user.password !== password) {
        return res.send('Incorrect password!')
    }

    req.session.userId = user.id;

    res.send('You are signed in!');

});

app.listen(3000, () => {
    console.log('listening');
})