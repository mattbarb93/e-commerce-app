const express = require('express');

const app = express();

//Setting up route handler. When receiving a network request from the browser. Req is the incoming request from the browser into our server. Res is the outgoing response from our server, back to the browser.

//If you wanna receive something, use req. If you wanna send something or communicate with the user,use res.
app.get('/', (req, res) => {
    //We will send a greeting to whoever made a request to server
    res.send('hi there');
});

//Application will start listening to any incoming requests

app.listen(3000, () => {
    console.log('listening');
})