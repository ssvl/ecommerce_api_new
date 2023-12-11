const mongoose = require('mongoose');
const MainCategory = require('../Model/MainCategory.model');
const SubCategory = require('../Model/SubCategory.model');
const Product = require('../Model/Product.model')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// exports.addSubategoryName = catchAsync(async (req, res, next) => {
//     const data = req.body
//     const { SubCateoryName } = data;
//     const catid = req.params.id;

//     const mainCategory = await MainCategory.findOne({ id: catid });

//     if (!mainCategory) {
//         return res.json({
//             status: 'fail',
//             message: 'Main Category not found.',
//         });
//     }

//     if (!SubCateoryName) {
//         return res.json({
//             status: 'fail',
//             message: 'Sub Category is required.',
//         });
//     }

//     // Check if a subcategory with the same name already exists within the main category
//     const existingSubcategory = await SubCategory.findOne({
//         SubCateoryName,
//         mainCategoryId: mainCategory.id,
//     });

//     if (existingSubcategory) {
//         return res.json({
//             status: 'fail',
//             message: 'Sub Category with the same name already exists in this Main Category.',
//         });
//     }

//     data.id = `SUBCAT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;
//     data.cart = data.cart || {};
//     data.cart.id = `SUBCAT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;

//     const subCategory = new SubCategory({ SubCateoryName, mainCategoryId: mainCategory.id });

//     await subCategory.save();

//     res.json({
//         status: 'success',
//         message: 'Sub Category added successfully.',
//         result: subCategory,
//     });
// });

// exports.addSubategoryName = catchAsync(async (req, res, next) => {
//     const data = req.body;
//     const { SubCateoryName } = data;
//     const catid = req.params.id;

//     const mainCategory = await MainCategory.findOne({ id: catid });

//     if (!mainCategory) {
//         return res.json({
//             status: 'fail',
//             message: 'Main Category not found.',
//         });
//     }

//     if (!SubCateoryName) {
//         return res.json({
//             status: 'fail',
//             message: 'Sub Category is required.',
//         });
//     }

//     const existingSubCategory = await SubCategory.findOne({ SubCateoryName: SubCateoryName });
// if (existingSubCategory) {
//     return res.json({
//         status: 'fail',
//         message: 'Sub Category with this name already exists.',
//     });
// }

  

//     // const id = `SUBCAT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;

//     data.id = catid;

//     const subCategory = new SubCategory({ ...data, mainCategoryId: mainCategory.id });

//     await subCategory.save();

//     res.json({
//         status: 'success',
//         message: 'Sub Category added successfully.',
//         result: subCategory,
//     });
// });

exports.addSubategoryName = catchAsync(async (req, res, next) => {
    const data = req.body;
    const { SubCateoryName } = data;
    const mainCategoryId = req.params.id;

    const mainCategory = await MainCategory.findOne({ id: mainCategoryId });

    if (!mainCategory) {
        return res.json({
            status: 'fail',
            message: 'Main Category not found.',
        });
    }

    if (!SubCateoryName) {
        return res.json({
            status: 'fail',
            message: 'Sub Category is required.',
        });
    }

    const existingSubCategory = await SubCategory.findOne({ SubCateoryName: SubCateoryName });
    if (existingSubCategory) {
        return res.json({
            status: 'fail',
            message: 'Sub Category with this name already exists.',
        });
    }

    data.id = `SUBCAT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;
    data.cart = data.cart || {};
    data.cart.id = `SUBCAT-${+new Date()}-${parseInt(Math.random() * 1000000 + 1000000)}`;
  

    const subCategory = new SubCategory({
        ...data,
        mainCategoryId: mainCategory.id,
        mainCategoryName: mainCategory.MaincategoryName, 
    });


    await subCategory.save();

    res.json({
        status: 'success',
        message: 'Sub Category added successfully.',
        result: subCategory,
    });
});

exports.getSubCategoryName = catchAsync(async (req, res, next) => {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const totalCategories = await SubCategory.countDocuments();

    const totalPages = Math.ceil(totalCategories / limit);

    const category = await SubCategory.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);


    res.json({
        status: 'success',
        message: 'Sub Category get successfully.',
        result: category,
        page: page,
        totalPages: totalPages
    });
})


exports.geAllCategoryName = catchAsync(async (req, res, next) => {
    const category = await MainCategory.find();
    const subcategory = await SubCategory.find();
   

    res.json({
        staus: 'success',
        message: 'Category get Succefully.',
        category: category,
        subCategory: subcategory
    });
})


exports.deletesubCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new Error('No id is provided!!'));
    }
    const deleteData = await SubCategory.findOneAndDelete({ mainCategoryId: id });

    if (!deleteData) {
        return next(new Error('No product found with the provided id.', 404));
    }

    res.json({
        msg: 'delete successful!!',
        status: 'success',
        result: deleteData
    });
});



exports.updateSubCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
 

    const data = req.body;
    

    if (!id) {
        return next(new Error('No ID is provided!!'));
    }

    // Extract MaincategoryName and SubCateoryName from the data object
    const { mainCategoryName, SubCateoryName } = data;

    try {
        // Check if a subcategory with the provided ID exists
        const existingSubCategory = await SubCategory.findOne({ id: id });

        if (!existingSubCategory) {
            return res.status(404).json({
                status: 'fail',
                message: 'No subcategory found with the provided ID.',
            });
        }

        // Check if SubCateoryName is being changed and if it will cause a duplicate key error
        if (SubCateoryName && SubCateoryName !== existingSubCategory.SubCateoryName) {
            // Check for existing documents with the new SubCateoryName
            const duplicateSubCategory = await SubCategory.findOne({ SubCateoryName: SubCateoryName });

            if (duplicateSubCategory) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Sub Category with this name already exists.',
                });
            }
        }

        // Update the subcategory
        const updatedSubCategory = await SubCategory.findOneAndUpdate(
            { id: id },
            {
                mainCategoryName: mainCategoryName || existingSubCategory.mainCategoryName,
                SubCateoryName: SubCateoryName || existingSubCategory.SubCateoryName,
            },
            { new: true, runValidators: true }
        );

        res.json({
            status: 'success',
            message: 'SubCategory updated successfully!!',
            result: updatedSubCategory,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while processing your request.',
        });
    }
});

  

// exports.searchSubCategory = catchAsync(async (req, res, next) => {
//         try {
        
    
//         const searchQueryName = req.query.SubCateoryName;
//         //   SubCateoryName: { $regex: new RegExp(searchQueryName, 'i') }, ye line add akarni he 188 : pachi maultiplae search mate 
//         if (searchQueryName) {
//             const categories = await SubCategory.find({
//             SubCateoryName: searchQueryName,
//             });
    
//             res.status(200).json(categories);
//         } else {
//             res.status(400).json({ message: 'Invalid search parameters' });
//         }
//         } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//         }
// });
    

exports.searchSubCategory = catchAsync(async (req, res, next) => {
    try {
      const searchQueryName = req.query.SubCateoryName;
      const searchQueryMainCategory = req.query.mainCategoryName;
      
      if (searchQueryName && searchQueryMainCategory) {
        const categories = await SubCategory.find({
          SubCateoryName: searchQueryName,
          mainCategoryName: searchQueryMainCategory,
        });
        
        res.status(200).json(categories);
      } else if (searchQueryName) {
        const categories = await SubCategory.find({
          SubCateoryName: searchQueryName,
        });
        
        res.status(200).json(categories);
      } else if (searchQueryMainCategory) {
        const categories = await SubCategory.find({
          mainCategoryName: searchQueryMainCategory,
        });
        
        res.status(200).json(categories);
      } else {
        res.status(400).json({ message: 'Invalid search parameters' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
});
  
exports.allDataCounter = catchAsync(async (req, res, next) => {
    try {
        const totalSubcategories = await SubCategory.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalCategories = await MainCategory.countDocuments()

        res.json({
            status: 'success',
            message: 'Data counts retrieved successfully.',
            totalSubcategories,
            totalProducts,
            totalCategories
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});
