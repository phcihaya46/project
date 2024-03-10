const db = require("../models/db");

exports.createProductType = async (req, res, next) => {
    try {
      const { name } = req.body;
      
      // Validation
      if (!(name)) {
        return next(new Error("Please provide all required fields"));
      }
  
      const product_type = await db.product_type.create({
        data: {
          name
        }
      });
  
      res.json({ msg: 'Product created successfully', product_type });
    } catch (error) {
      next(error);
    }
  };