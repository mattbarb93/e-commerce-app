const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const app = express();

//Syntax for bodyParser.urlencoded: used specifically to handle an HTML form. Will take the information from the user, parse it, and send it to our server. Set it like this so its done globally
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['nqoidnqpiwdnqpdqwpo'] //Used to encrypt the user's cookie since it's a random string
}));
app.use(authRouter);




app.listen(3000, () => {
    console.log('listening');
})