const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addProductSchema = new Schema({
    pName: {
        type: String

    },
    price: {
        type: String
        



        

    },
    details: {
        type: String
    },
    pImg: [{
        data: Buffer,
        type: String,
    }],
    discountPrice: {
        type: Number
    },
    subCategoryId: {
        type: String,
    },
    subcategoryName:{
        type: String,
    }
}, { timestamps: true });

const AddProduct = mongoose.model('AddProduct', addProductSchema);
module.exports = AddProduct;