const db = require("../models/db");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



exports.createproduct = async (req, res, next) => {
  try {
    const { name, price, unit, decription, url, protypeId, author } = req.body;
    // console.log(req.body);
    // Validation
    // if (!(name && price && unit && decription && url && productType_id)) {
    //   return next(new Error("Please provide all required fields"));
    // }

    const product = await db.product.create({
      data: {
        name,
        price: Number(price),
        unit: Number(unit),
        decription,
        author,
        url,
        protypeId: Number(protypeId),
      },
    });

    res.json({ msg: "Product created successfully", product });
  } catch (error) {
    next(error);
  }
};

exports.getmenutems = async (req, res, next) => {
  try {
    const product = await db.product.findMany();
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.protype = async (req, res, next) => {
  // const {name , decription } = req.body
  const data = req.body;
  try {
    const rs = await db.product_type.create({
      data: { ...data },
      // data: {...data, userId: req.user.id}
    });
    res.json({ msg: "Create Ok", result: rs });
    // res.json(rs)
  } catch (err) {
    next(err);
  }
};

//GET PROTYPE
exports.getProList = async (req, res, next) => {
  try {
    const product_type = await db.product_type.findMany();
    res.json({ product_type });
    next();
  } catch (err) {
    next(err);
  }
};

//DELETE PROTYPE
exports.deleteProtype = async (req, res, next) => {
  const { id } = req.params;
  try {
    const rs = await db.product_type.delete({ where: { id: +id } });
    res.json({ msg: "Delete Ok", result: rs });
  } catch (err) {
    next(err);
  }
};
//////////////////////////////////////////////////////////
exports.cartproduct = async (req, res, next) => {
  try {
    // รับข้อมูลจาก request body
    const { productId } = req.body;/////
    // const { productId } = req.body;
    // console.log(req.body);

    // const userId = req.user.id;

    // if (!userId) {
    //   return res.status(400).json({ error: "User ID not found" });
    // }

    const newCartProduct = await db.cart.create({
      data: {
        // product: { connect: { id: productId} },
        userId: req.user.id,
        productId,/////
        // userId,
        // unit: 1,
      },
    });

    // res.status(201).json({
    //   message: "Cart product created successfully",
    //   cartProduct: newCartProduct,
    // });
    res.json(newCartProduct);
  } catch (error) {
    // console.error("Error creating cart product:", error);
    // res.status(500).json({ error: "Failed to create cart product" });
    next(error);
  }
};

// exports.getCartItems = async (req, res, next) => {  ของพี่ออฟ
//   try {
//     const getCartItems = await db.cart.findMany({
//       where: {
//         userId: req.user.id,
//       },
//       include: {
//         Detail: true
//       },
     
//     });
//     res.json(getCartItems);
//     console.log(getCartItems)
//   } catch (error) {
//     next(error);
//   }
// };


exports.getCartItems = async (req, res, next) => {
  try {
    const getCartItems = await db.cart.findMany({
      where: {
        userId: req.user.id,
      },
      // include: {
      //   product: true
      // },
    });
    res.json(getCartItems);
    // console.log(getCartItems)
  } catch (error) {
    next(error);
  }
};


// exports.deleteCart = async (req, res, next) => {
//   const { productId } = req.params;
//   // console.log(typeof id)
//   try {
//     const getCart = await db.cart.findFirst({
//       where: { productId: Number(productId) },
//     });
//     if (getCart) {
//       console.log(getCart);
//       const rs = await db.cart.delete({ where: { id: getCart.id } });
//       res.json({ msg: "Delete  Ok", result: rs });
//     }
//   } catch (err) {
//     next(err);
//   }
// };

exports.deleteCart = async (req, res, next)=>{
  const {productId} = req.params
  try {
    const rs = await db.cart.delete({where:{id:+productId}})
    res.json({msg:'Delete Ok',result: rs})
  } catch (err) {
    next(err)
  }
}


exports.orderProduct = async (req, res, next) => {
  try {
    const {datetime, status, total} = req.body;
    // console.log(cartId);

    const { productId } = req.body;
    
    const getCart1 = await db.cart.findFirst({
      where: {
        userId: req.user.id,
      },
    });
  if (getCart1) {
      await db.order.create({
        data: {
          userId: req.user.id,
          datetime,
          status,
          cartId: getCart1.id,
          total
        },
      });
    }
    const findOrder = await db.order.findFirst({///////
      where: {
        userId: req.user.id,
      },
    });
    if (findOrder) {
      await db.orderdetail.create({
        data: {
          productId:Number(productId),
          orderId: findOrder.id,
        },
      });
    }
    

    // const getorder = await db.order.findFirst({//
    //   where: {
    //     userId: req.user.id,
    //   },
    // });
    // const findCart = await db.cart.findFirst({
    //   where: {
    //     userId: req.user.id,
    //   },
    // });
    // if (findCart) {
    //   await db.orderdetail.create({
    //     data: {
    //       productId,
    //       orderId: getorder.id,
    //     },
    //   });
    // }
    


  
    res.json(getCart1);
  } catch (error) {
    next(error);
  }
};

exports.detail = async (req, res, next) => {
  try {
    // const { productId } = req.params;
    const { productId } = req.body;
    // console.log(cartId);
    const getCart = await db.cart.findFirst({
      where: {
        userId: req.user.id,
      },
    });

    if (!getCart) {
      await db.cart.create({
        data: {
          userId: req.user.id,
         
        },
      });
    }
    const findCart = await db.cart.findFirst({
      where: {
        userId: req.user.id,
      },
    });

    if (findCart) {
      await db.detail.create({
        data: {
          productId,
          cartId: findCart.id,
        },
      });
    }
//     const getorder = await db.order.findFirst({//
//       where: {
//         userId: req.user.id,
//       },
//     });
//     if (getorder) {
//       await db.orderdetail.create({
//         data: {
//           productId,
//           orderId: getorder.id,
//         },
//       });
//     }
// //
    res.json("newOrder");
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const getOrder = await db.order.findFirst({
      where: {
        userId: req.user.id,
      },
      include: {
        cart: true,
      },
    });

    res.json(getOrder);
  } catch (error) {
    next(error);
  }
};

////test
// exports.orderdetail = async (req, res, next) => {
//   try {
    
//     const { productId } = req.body;
   
//     const getorder = await db.order.findFirst({
//       where: {
//         userId: req.user.id,
//       },
//     });

//     if (getorder) {
//       await db.cart.findFirst({
//         data: {
//           userId: req.user.id,
         
//         },
//       });
//     }
//     const findCart = await db.cart.findFirst({
//       where: {
//         userId: req.user.id,
//       },
//     });

//     if (findCart) {
//       await db.orderdetail.create({
//         data: {
//           productId,
//           orderId: findCart.id,
//         },
//       });
//     }
//     res.json("newOrder");
//   } catch (error) {
//     next(error);
//   }
// };
