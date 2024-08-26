const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");

if (process.env.Node_ENV === "development") {
  router.post("/create", async (req, res) => {
    let owners = await ownerModel.find();
    if (owners.length > 0) {
      return res
        .status(504)
        .send("You don't have permission to create a new owner");
    }

    let { fullname, email, password } = req.body;

    let createdOwner = await ownerModel.create({
      fullname,
      email,
      password,
    });
    res.status(201).send(createdOwner);
  });
}

router.get("/admin", (req, res) => {
  let success = req.flash("success");
  res.render("createproducts", { success });
});

// Route to display all products
router.get("/products", async (req, res) => {
  try {
    const products = await productModel.find();
    res.render("admin", { products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Route to handle form submission for creating a new product
// router.post("/create", upload.single("image"), async (req, res) => {
//   try {
//     const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;
//     const newProduct = new productModel({
//       name,
//       price,
//       discount,
//       bgcolor,
//       panelcolor,
//       textcolor,
//       image: req.file ? req.file.buffer.toString("base64") : undefined,
//     });
//     await newProduct.save();
//     req.flash("success", "Product created successfully");
//     res.redirect("/owners/admin");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// });

// Route to delete all products
router.get("/products/delete", async (req, res) => {
  try {
    await productModel.deleteMany();
    res.redirect("/owners/products");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Route to edit a product (show form)
router.get("/products/edit/:id", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    res.render("editProduct", { product });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Route to handle form submission for editing a product
router.post("/products/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;
    await productModel.findByIdAndUpdate(req.params.id, {
      name,
      price,
      discount,
      bgcolor,
      panelcolor,
      textcolor,
      image: req.file ? req.file.buffer.toString("base64") : undefined,
    });
    req.flash("success", "Product updated successfully");
    res.redirect("/owners/products");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
