const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", (req, res) => {
  let error = req.flash("error");
  res.render("index", { error, loggedin: false });
});

router.get("/shop", isLoggedin, async (req, res) => {
  let products = await productModel.find();
  let success = req.flash("success");
  res.render("shop", { products, success });
});

router.get("/cart", isLoggedin, async (req, res) => {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");

  // Calculate bill for each item
  let cartItems = user.cart.map((item) => {
    const price = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    const netTotal = price - (price * discount) / 100;
    return {
      ...item.toObject(),
      netTotal,
    };
  });

  // Calculate overall bill (sum of all net totals plus platform fee)
  const platformFee = 20;
  const totalBill = cartItems.reduce(
    (acc, item) => acc + item.netTotal,
    platformFee
  );

  res.render("cart", { user, cartItems, totalBill });
});

router.post("/removefromcart/:productId", isLoggedin, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email });

    // Remove the product from the cart
    user.cart.pull(req.params.productId);
    await user.save();

    res.json({ success: true, message: "Product removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
});

router.get("/addtocart/:productid", isLoggedin, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.productid);
  await user.save();
  req.flash("success", "Added to cart");
  res.redirect("/shop");
});

router.get("/logout", isLoggedin, (req, res) => {
  res.render("shop");
});

module.exports = router;
