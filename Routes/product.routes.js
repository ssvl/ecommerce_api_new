    const router = require('express').Router();
    const { addProduct, uploadImage, getAllProduct,uploadImageUpdate,deleteProduct,updateProduct,searchProduct } = require('../Cotroller/Product.cotroller')
    const bodyParser = require('body-parser');
    const jsonParser = bodyParser.json();
    const urlencodedParser = bodyParser.urlencoded({ extended: false });

    router.post('/addProduct/:id', uploadImage, addProduct);
    router.get('/getAllProduct/:page', getAllProduct)
    router.delete('/deleteproduct/:id', deleteProduct)
    router.patch('/updateproduct/:id',uploadImageUpdate,updateProduct)
    router.get('/searchproduct',searchProduct)

    module.exports = router;    