const router = require('express').Router();
const {addSubategoryName,getSubCategoryName,geAllCategoryName,deletesubCategory,allDataCounter,searchSubCategory,updateSubCategory} =  require('../Cotroller/SubCategory.controller')

router.post('/addSubcategory/:id', addSubategoryName);
router.get('/getsubcategory/:page', getSubCategoryName);
router.get('/getallcategory', geAllCategoryName);
router.delete('/deletesubcategory/:id',deletesubCategory);
router.patch('/updatesubcategiry/:id',updateSubCategory)
router.get('/searchsubcategory',searchSubCategory);
router.get('/alldatacount',allDataCounter)
// router.get('/searchsubcategory', searchSubCategory);
module.exports = router;    