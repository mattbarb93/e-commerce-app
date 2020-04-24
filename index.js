const express = require('express');
const bodyParser = require('body-parser');

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



app.post('/', (req, res) => {
    console.log(req);
    
    res.send('Account created!');
});

app.listen(3000, () => {
    console.log('listening');
})