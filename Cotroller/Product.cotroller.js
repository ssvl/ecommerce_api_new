const _ = require('lodash');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Product = require('../Model/Product.model');
const SubCategory = require('../Model/SubCategory.model');
var FormData = require('form-data');
const formidable = require('formidable');
const fs = require('fs');
const bodyParser = require('body-parser');

// Configure multer for storing uploaded images
const multer = require('multer');
const path = require('path');

const addStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const filename = file.originalname;
    console.log(filename);
    req.uploadedFileName = filename;
    cb(null, filename);
  },
});

const addUpload  = multer({ storage: addStorage  });
exports.uploadImage = addUpload .array('pImg', 5);


const updateStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const filename = file.originalname;
    cb(null, filename);
  },
});

const updateUpload = multer({ storage: updateStorage });
exports.uploadImageUpdate = updateUpload .array('pImg', 5);

exports.addProduct = catchAsync(async (req, res, next) => {
  const data = req.body;
  const { pName, price, details, discountPrice } = data;
  const subCatId = req.params.id;

  try {
    const existingSubCategory = await SubCategory.findOne({ id: subCatId });

    if (!existingSubCategory) {
      return res.status(404).json({
        status: 'fail',
        message: 'Subcategory not found.',
      });
}

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {

      return res.status(400).json({
        status: 'error',
        message: 'Please upload at least one image.',
      });
    }


    const uploadedImages = req.files;

    if (uploadedImages.length < 1 || uploadedImages.length > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload between 1 and 5 images.',
      });
    }

    const addProductData = new Product({
      subCategoryId: existingSubCategory.id,
      pName: pName,
      price: price,
      details: details,
      discountPrice: discountPrice,
      subcategoryName:existingSubCategory.SubCateoryName

    });

    const imageFileNames = [];

    // Iterate over the uploaded images and store their filenames
    for (const image of uploadedImages) {
      imageFileNames.push(image.filename);
    }

    addProductData.pImg = imageFileNames;

    await addProductData.save();

    res.json({
      status: 'success',
      message: 'Data Added successfully.',
      result: addProductData,
    });
  } catch (error) {
    next(error);
  }
});

exports.getAllProduct = catchAsync(async (req, res, next) => {
  const page = parseInt(req.params.page) || 1;

  const limit = parseInt(req.query.limit) || 5; // Number of records per page, default to 10

  const skip = (page - 1) * limit;
  const totalCategories = await Product.countDocuments();
  const totalPages = Math.ceil(totalCategories / limit);
  const product = await Product.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    status: 'success',
    message: 'Product get successfully.',
    result: product,
    page: page,
    totalPages: totalPages
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  if (!id) {
    return next(new Error('No id is provided!!'));
  }
  const deleteData = await Product.findOneAndDelete({ subCategoryId: id });
  if (!deleteData) {
    return next(new Error('No product found with the provided id.', 404));
  }

  res.json({
    msg: 'delete successful!!',
    status: 'success',
    result: deleteData
  });
});

// exports.updateProduct = catchAsync(async (req, res, next) => {
//   const productId = req.params.id;

  
//   const form = new formidable.IncomingForm();

  
//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error parsing form data' });
//     }

//     try {
     
//       const details = Array.isArray(fields.details) ? fields.details.join(', ') : fields.details;
//       const discountPrice = Array.isArray(fields.discountPrice) ? fields.discountPrice.join(', ') : fields.discountPrice;
//       const subCategoryId = Array.isArray(fields.subCategoryId) ? fields.subCategoryId.join(', ') : fields.subCategoryId;

      
//       let pName = fields.pName;
//       let price = fields.price;

   
//       if (Array.isArray(pName)) {
//         pName = pName[0]; 
//       }
//       if (Array.isArray(price)) {
//         price = parseFloat(price[0]); 
//       }

//       const pImgFiles = req.files; // Array of uploaded files
//       console.log(pImgFiles)
//       const pImg = pImgFiles.map((file) => file.path); // Array of file paths

     
//       const updatedProduct = await Product.findOneAndUpdate(
//         { _id: productId },
//         {
//           pName: pName,
//           price: price,
//           details: details,
//           discountPrice: discountPrice,
//           subCategoryId: subCategoryId,
//           pImg: pImg, // Store the array of file paths
//         },
//         { new: true } // To return the updated product
//       );


//       if (!updatedProduct) {
//         return res.status(404).json({ message: 'Product not found' });
//       }

//       res.status(200).json({ message: 'Product updated successfully', updatedProduct });
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });
// });

// exports.updateProduct = catchAsync(async (req, res, next) => {

//   const productId = req.params.id;

//   const form = new formidable.IncomingForm();

//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error parsing form data' });
//     }

//     try {
//       const details = Array.isArray(fields.details) ? fields.details.join(', ') : fields.details;
//       const discountPrice = Array.isArray(fields.discountPrice) ? fields.discountPrice.join(', ') : fields.discountPrice;
//       const subCategoryId = Array.isArray(fields.subCategoryId) ? fields.subCategoryId.join(', ') : fields.subCategoryId;

//       let pName = fields.pName;
//       let price = fields.price;

//       if (Array.isArray(pName)) {
//         pName = pName[0];
//       }
//       if (Array.isArray(price)) {
//         price = parseFloat(price[0]);
//       }

//       // Check if files were uploaded
//       if (!req.files || req.files.length === 0) {
//         // No files were uploaded, update other fields and return
//         const updatedProduct = await Product.findOneAndUpdate(
//           { _id: productId },
//           {
//             pName: pName,
//             price: price,
//             details: details,
//             discountPrice: discountPrice,
//             subCategoryId: subCategoryId,
//           },
//           { new: true } // To return the updated product
//         );

//         if (!updatedProduct) {
//           return res.status(404).json({ message: 'Product not found' });
//         }

//         return res.status(200).json({ message: 'Product updated successfully', updatedProduct });
//       }

//       // If files were uploaded, proceed with mapping them
//       const pImgFiles = req.files;
//       const pImg = pImgFiles.map((file) => ({
//         data: fs.readFileSync(file.path), // Read the file data
//         type: file.type, // Set the file type
//       }));

//       const updatedProduct = await Product.findOneAndUpdate(
//         { _id: productId },
//         {
//           pName: pName,
//           price: price,
//           details: details,
//           discountPrice: discountPrice,
//           subCategoryId: subCategoryId,
//           pImg: pImg, // Store the array of file data and types
//         },
//         { new: true } // To return the updated product
//       );

//       if (!updatedProduct) {
//         return res.status(404).json({ message: 'Product not found' });
//       }

//       res.status(200).json({ message: 'Product updated successfully', updatedProduct });
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });
// });



exports.searchProduct = async (req, res) => {
  try {
    const { pName, price, discountPrice } = req.query;

    let query = {};

    if (pName) {
      query.pName = { $regex: new RegExp(pName, 'i') };
    }

    if (price) {
      query.price = parseFloat(price);
    }

    if (discountPrice) {
      query.discountPrice = parseFloat(discountPrice);
    }

    const products = await Product.find(query);

    // if (products.length === 0) {
    //   return res.status(404).json({ message: 'No products found' });
    // }

    return res.status(200).json(products);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateProduct = catchAsync(async (req, res, next) => {
  try {
    const updateData = {
      pName: req.body.pName,
      price: req.body.price,
      details: req.body.details,
      discountPrice: req.body.discountPrice,
      subcategoryName:req.body.subcategoryName,
      pImg: [], 
    };

    req.files.forEach((file) => {
      updateData.pImg.push(file.filename);
    });

    const update = await Product.findByIdAndUpdate(req.params.id, updateData);

    if (!update) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = await Product.findById(req.params.id).exec();

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
