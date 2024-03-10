const express = require('express')
const router = express.Router()
const authenticate =require('../middlewares/authenticate')
const authController = require('../controllers/auth-controller')
const  productController = require('../controllers/product-controller')
const  productType = require('../controllers/productType')


router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/me', authenticate, authController.getme) 
router.get('/getCartByUser', authenticate, authController.getCartByUser) 
router.get('/getproduct/:id',  authController.getProductById) 

router.put('/:id', authenticate, authController.updateUser) 


router.post('/cartproduct',authenticate,productController.cartproduct)
router.post('/cartproduct1',authenticate,productController.detail)
// router.post('/orderdetail',authenticate,productController.orderdetail)//////
router.get('/getCartItems',authenticate,productController.getCartItems)

router.post('/protype',authenticate,productType.createProductType)
router.post('/create',authenticate,productController.createproduct)
router.get('/product',authenticate,productController.getmenutems)


router.delete('/deleteCart/:productId',authenticate,productController.deleteCart)

router.post('/orderProduct',authenticate,productController.orderProduct)



router.get('/category/:protypeId', authController.getBooksByCategory);
router.get('/AddmingetOrder', authController.AddmingetOrder);

router.get('/getOrder', authenticate, productController.getOrder)
// router.get('/getproduct/:id', authenticate, productController.getPro)



module.exports = router