const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users')

const app = express();

//Syntax for bodyParser.urlencoded: used specifically to handle an HTML form. Will take the information from the user, parse it, and send it to our server. Set it like this so its done globally
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req, res) => {

    //Adding method="POST". Its associated with creating a record of some kind, like an user account!
    res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email" />
            <input name="password" placeholder="password" />
            <input name="passwordConfirmation" placeholder="password confirmation" />
            <button>Sign Up</button>
        </form>
    </div>
    
    `);
});



app.post('/', async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;

    //Input validation
    const existingUser = await usersRepo.getOneBy({email});
    if (existingUser) {
        return res.send('Email in use');
    }

    if (password !== passwordConfirmation) {
        return res.send('Passwords must match!')
    }
    
    // Create a user in our user repo to represent this person

    const user = await usersRepo.create({email, password});

    //Store the ID of that user inside the user's cookies


    res.send('Account created!');
});

app.listen(3000, () => {
    console.log('listening');
})