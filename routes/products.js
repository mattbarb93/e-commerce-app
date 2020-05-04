const express = require('express');
const productsRepo = require('../repositories/products');
const productsIndexDirectory = require('../views/products/index')

const router = express.Router();

router.get('/', async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexDirectory({products}))
});

module.exports = router;