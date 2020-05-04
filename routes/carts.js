const express = require('express');
const cartsRepo = require('../repositories/carts')

const router = express.Router();

// Receive a post request to add an item
router.post('/cart/products', async (req, res) => {

    //Figure out the cart: do we have a cart for this user already, or do we create a new one?

    let cart;
    if(!req.session.cartId) {
        //we dont have a cart, we need to create one, and store the cart id on req.session.cartId property

        cart = await cartsRepo.create( { items: [] });
        req.session.cartId = cart.id;
    } else {
        cart = await cartsRepo.getOne(req.session.cartId);
    }

    //Either increment quantity for product, or create a new item in items array

    const existingItem = cart.items.find(item => item.id === req.body.productId);

    if(existingItem) {
        //increment quantity
        existingItem.quantity++
    } else {
        //add new product to items array
        cart.items.push({id: req.body.productId, quantity: 1});
    }
    await cartsRepo.update(cart.id, {
        items: cart.items
    });

    res.send('Product added to cart');
})

//Receive a GET request to show all items in the cart

//Receive a post request to delete an item

module.exports = router;