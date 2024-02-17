const db = require('../models/db')
const multer = require('multer');

exports.getByUser = async (req, res, next) => {
  try {
    const product = await db.product.findMany({
      where : { userId : req.user.id}
    })
    res.json({product})
  } catch (err) {
    next(err)
  }

}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage }).single('url');

exports.createProduct = async(req,res,next)=>{
  //validation req.body
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    const { name, price,  unit, decription, stock ,productType} = req.body;
    const url = req.file ? req.file.filename : null;
    try{
      const rs = await db.product.create({
        data: {
          name: name,
          unit: parseInt(unit),
          decription: decription,
          stock: parseInt(stock),
          price: parseInt(price),
          url: url,
          productType:productType,
          user: req.user.id,
        }
      });
      res.json({ msg: 'Create Success', result: rs })
    } catch(err) {
      next(err)
    }
  })
}

//CREATE PROTYPE
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

//DELETE PROTYPE
exports.deleteProtype = async (req, res, next) => {
  const {id} = req.params
  try {
    const rs = await db.product_type.delete({where:{id:+id, userId:req.user.id}})
    res.json({msg:'Delete Ok',result: rs})
  } catch (err) {
    next(err)
  }
}



// exports.updateTodo = async (req, res, next) => {
//   // validate req.params + req.body
//   const {id} = req.params
//   const data = req.body
//   try {
//     const rs = await db.todo.update({
//       data :  {...data},
//       where: { id : +id , userId : req.user.id} 
//     })
//     res.json({msg: 'Update ok', result: rs})
//   }catch(err){
//     next(err)
//   }
// }

// exports.deleteProtype = async (req, res, next)=>{
//   const {id} = req.params
//   try {
//     const rs = await db.todo.delete({where:{id:+id, userId:req.user.id}})
//     res.json({msg:'Delete Ok',result: rs})
//   } catch (err) {
//     next(err)
//   }
// }