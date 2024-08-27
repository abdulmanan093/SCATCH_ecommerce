const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      req.flash("error", "You already have an account, please login");
      return res.redirect("/");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await userModel.create({
      fullname,
      email,
      password: hashedPassword,
    });

    req.flash(
      "success",
      "Your account has been created successfully. Please login."
    );
    return res.redirect("/"); // Redirect to the login page
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports.loginUser = async (req, res) => {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email: email });
  if (!user) {
    req.flash("error", "Email or Password incorrect");
    return res.redirect("/");
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      let token = generateToken(user);
      res.cookie("token", token);
      res.redirect("/shop");
    } else {
      req.flash("error", "Email or Password incorrect");
      return res.redirect("/");
    }
  });
};

module.exports.logout = (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
};
