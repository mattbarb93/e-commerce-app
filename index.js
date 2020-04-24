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
            <input name"password confirmation" placeholder="password confirmation" />
            <button>Sign Up</button>
        </form>
    </div>
    
    `);
});

//Send a message to the screen, once the incoming request is sent aka when the form is submitted
app.post('/', (req, res) => {
    res.send('Account created!');
});

//Application will start listening to any incoming requests

app.listen(3000, () => {
    console.log('listening');
})