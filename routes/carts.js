const express = require('express');

const router = express.Router();

// Receive a post request to add an item
router.post('/cart/products', (req, res) => {
    console.log(req.body.productId);

    res.send('Product added to cart');
})

//Receive a GET request to show all items in the cart

//Receive a post request to delete an item

module.exports = router;