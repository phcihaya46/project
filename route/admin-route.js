const express = require("express");
const adminController = require("../controllers/admin-controller");
const router = express.Router();
const authenticate = require('../middlewares/authenticate')

router.get('/user', adminController.getUser)
router.get('/all-status', authenticate, adminController.getAllStatus)

router.put('/updateType/:id',adminController.updateTodo)/////
router.patch('/updateproduct/:id', adminController.updateProduct) ////


router.delete('/deleteProduct/:id',authenticate,adminController.deleteProduct)
router.delete('/:id',authenticate,adminController.deleteTodo)

router.post('/protype',authenticate,adminController.protype)

router.get('/getProList',adminController.getProList)

module.exports = router;
