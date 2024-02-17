const express = require('express')
const router = express.Router()
const authenticate = require('../middlewares/authenticate')
const productController = require('../controllers/product-controller')


router.get('/',authenticate,productController.getByUser)
router.post('/',authenticate,productController.createProduct)
router.post('/protype',authenticate,productController.protype)
router.get('/getprolist',productController.getProList)
router.delete('/deleteProductType', productController.deleteProtype )

module.exports = router