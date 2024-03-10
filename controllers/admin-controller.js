const db = require("../models/db")
const { Status } = require('@prisma/client')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

exports.getUser = async (req, res, next ) => { 
  try {
    const user = await db.user.findMany();
    res.json({user});
    next()
  } catch (err) {
    next(err)
  }
}


//Update Product Type
exports.updateTodo = async (req, res, next) => {
  // validate req.params + req.body
  const {id} = req.params //เก็บค่า ไอดี ที่ถูกส่งมา
  const data = req.body //เก็บข้อมูลที่ถูกส่งมากับ รีเควส ก็คือname
  try {
    const rs = await db.product_type.update({
      data :  {...data},
      where: { id : +id } 
    })
    res.json({msg: 'Update ok', result: rs})
  }catch(err){
    next(err)
  }
}


//DELETE PRODUCT TYPE
exports.deleteTodo = async (req, res, next)=>{
  const {id} = req.params
  try {
    const rs = await db.product_type.delete({where:{id:+id}})
    res.json({msg:'Delete Ok',result: rs})
  } catch (err) {
    next(err)
  }
}


//DELETE PRODUCT
exports.deleteProduct = async (req, res, next)=>{
  const {id} = req.params
  try {
    const rs = await db.product.delete({where:{id:+id}})
    res.json({msg:'Delete Ok',result: rs})
  } catch (err) {
    next(err)
  }
}



exports.getAllStatus = async(req, res, next) => {
  res.json({status: Object.values(Status)})
}


//Create Product Type
exports.protype = async (req, res, next)=>{
  // const {name , decription } = req.body
  const data = req.body
  try {
    const rs = await db.product_type.create({
      data: {...data}
      // data: {...data, userId: req.user.id}
    })
    res.json({msg:'Create Ok',result: rs})
    // res.json(rs)
  } catch (err) {
    next(err)
    
  }
}


//GET PROTYPE
exports.getProList = async (req, res, next) => {
  try {
    const product_type = await db.product_type.findMany()
    res.json({product_type})
    next()
  } catch (err) {
    next(err)
  }

}

//Update Product
exports.updateProduct = async (req, res, next) => {
  // validate req.params + req.body
  const {id} = req.params
  const {  name,
  price,
  unit,
  decription,
  url,
  protypeId,
  author} = req.body
  try {
    const rs = await db.product.update({
      data :  {name,
        price:Number(price),
        unit,
        decription,
        url,
        protypeId:Number(protypeId),
        author},
      where: { id :Number(id) } 
    })
    res.json({msg: 'Update ok', result: rs})
  }catch(err){
    next(err)
  }
}

