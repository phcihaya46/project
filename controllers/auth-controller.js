const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/db");

module.exports.register = async (req, res, next) => {
  const { username, password, confirmPassword, email ,firstname ,lastname ,phone ,address} = req.body;
  try {
    // validation
    if (!(username && password && confirmPassword)) {
      return next(new Error("Fulfill all inputs"));
    }
    if (confirmPassword !== password) {
      throw new Error("confirm password not match");
    }

    const hashedPassword = await bcrypt.hash(password, 8); //สร้างแฮชรหัส 8 รอบ
    // console.log(hashedPassword);
    const data = {
      username,
      password: hashedPassword,
      email,
      firstname,
      lastname,
      phone,
      address
    };

    const rs = await db.user.create({ data });
    // console.log(rs)

    res.json({ msg: "Register successful" });
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    // validation
    if (!(username.trim() && password.trim())) {
      throw new Error("username or password must not blank");
    }
    // find username in db.user
    const user = await db.user.findFirstOrThrow({ where: { username } });
    // check password
    const pwOk = await bcrypt.compare(password, user.password);
    if (!pwOk) {
      throw new Error("invalid login");
    }
    // issue jwt token
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    // console.log(token)
    res.json({ token: token });
  } catch (err) {
    next(err);
  }
};

exports.getme = (req, res, next) => {
  res.json(req.user);
};

//Update Profile
exports.updateUser = async (req, res, next) => {
  // validate req.params + req.body
  const { id } = req.params;
  const data = req.body;
  try {
    const rs = await db.user.update({
      data: { ...data },
      where: { id: +id },
    });
    res.json({ msg: "Update ok", result: rs });
  } catch (err) {
    next(err);
  }
};

exports.getcartByUser = async (req, res, next) => {
  try {
    const getcart = await db.cart.findMany({
      where: { userId: req.user.id },
    });
    res.json({ getcart });
  } catch (err) {
    next(err);
  }
};


exports.getProductById = async (req, res, next) => {
  const productId = req.params.id; // รับ ID จาก params
  try {
    const product = await db.product.findUnique({
      where: {
        id: Number(productId), // ค้นหาสินค้าด้วย ID
      },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.getCartByUser = async (req, res, next) => {
  try {
    const getCart = await db.cart.findMany({
      where: { userId: req.user.id },
    });
    res.json({ getCart });
  } catch (err) {
    next(err);
  }
};

exports.getBooksByCategory = async (req, res, next) => {
  try {
    const protypeId = req.params.protypeId;
    const books = await db.product.findMany({
      where: { protypeId: Number(protypeId) }, // แปลง protypeId เป็น Integer ก่อนค้นหา
    });
    res.json(books);
  } catch (error) {
    next(error);
  }
};

exports.AddmingetOrder = async (req, res, next) => {
  try {
    const orders = await db.order.findMany({
      include: {
        cart: {
          include: { //ระบุข้อมูลที่ต้องการรวมเข้ามา
            user: {  //ระบุฟิลด์ที่เกี่ยวข้อง
              select: {
                firstname: true,
                lastname: true,
                address: true,
                phone: true,
              },
            },
            Detail: true, //ระบุฟิลด์ที่เกี่ยวข้อง
          },
        },
      },
    });

    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

