const express = require('express');

const app = express();

//Setting up route handler. When receiving a network request from the browser. Req is the incoming request from the browser into our server. Res is the outgoing response from our server, back to the browser.

//If you wanna receive something, use req. If you wanna send something or communicate with the user,use res.


//Displaying some HTML on the page. 
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

//Adding code to get access to Email, Password, and Password confirmation submitted by the user back to the server
app.post('/', (req, res) => {
    //On method is the same as addEventListener: run a function whenever some event occours aka the data event. Data is apssed as the first arg to this callback function, so the console.log. Will display it as a buffer, so we will need to convert it to a string. This is all behind the scenes stuff
    req.on('data', data => {
        const parsed = data.toString('utf8').split('&');
        const formData = {};
        for (let pair of parsed) {
            const [key, value] = pair.split('=');
            formData[key] = value;
        }
        console.log(formData);
    })
    res.send('Account created!');
});

//Application will start listening to any incoming requests

app.listen(3000, () => {
    console.log('listening');
})