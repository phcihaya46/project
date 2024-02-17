const db = require("../models/db")

exports.getUser = async (req, res, next ) => {
  try {
    const user = await db.user.findMany();
    res.json({user});
    next()
  } catch (err) {
    next(err)
  }
}

