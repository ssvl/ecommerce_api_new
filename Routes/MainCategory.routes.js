const router = require('express').Router();
const {mainCategoryName,getCategoryName,deleteCategoryData,deleteByCatId,searchCategory,
    updateMaincategory} =  require('../Cotroller/MainCategory.controller')

router.post('/addcategory', mainCategoryName);
router.get('/getcategory/:page', getCategoryName);
// router.delete('/deleteategory/:id',deleteCategoryData),
router.delete('/deleteByCatId/:catId', deleteByCatId)
router.patch('/updatecategory/:id',updateMaincategory);
// router.get('/searchcategory/:q(*)',searchCategory)
router.get('/searchcategory', searchCategory);




module.exports = router;    

