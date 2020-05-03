const express = require('express');
const multer = require('multer');


const { handleErrors, requireAuth } = require('./middleware');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); //middleware function


const { requirePrice, requireTitle } = require('./validators')


router.get('/admin/products', requireAuth, async (req, res) => {

    if (!req.session.userId) {
        return res.redirect('/signin')
    }

    const products = await productsRepo.getAll();
    res.send(productsIndexTemplate({ products }));
});

router.get('/admin/products/new', requireAuth, (req, res) => {

    if (!req.session.userId) {
        return res.redirect('/signin')
    }

    res.send(productsNewTemplate({}));
});

router.post(
    '/admin/products/new',
    requireAuth,
    upload.single('image'),
    [requireTitle, requirePrice],
    handleErrors(productsNewTemplate),
    async (req, res) => {

        if (!req.session.userId) {
            return res.redirect('/signin')
        }

        const image = req.file.buffer.toString('base64');
        const { title, price } = req.body;
        await productsRepo.create({ title, price, image });

        res.redirect('/admin/products');
    })

module.exports = router;