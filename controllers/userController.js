const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { hashPassword, comparePassword } = require("../helpers/authHeper");
var { expressjwt: jwt } = require("express-jwt");
//middleware
const requierSignIn = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

//register
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check valid
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!password || password < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and more 6 character long",
      });
    }
    //existting user
    const existtingUser = await userModel.findOne({ email: email });
    if (existtingUser) {
      return res.status(500).send({
        success: false,
        message: "User already register wit this email",
      });
    }
    //hashed password
    const hashedPassword = await hashPassword(password);
    //save user
    const user = await userModel({
      name,
      email,
      password: hashedPassword,
    }).save();
    return res.status(201).send({
      success: true,
      message: "Register Successful! Please Login",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error Register API",
      error,
    });
  }
};

//login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Plese provide email or password",
      });
    }
    //find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User not found",
      });
    }

    //mactch password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(500).send({
        success: false,
        message: "Invalid password or email",
      });
    }

    //TOken jwt
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //undefied password
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "Login successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in login API",
      error,
    });
  }
};

//update user
const updateUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //user find
    const user = await userModel.findOne({ email });
    //passowrd valide
    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and shoud be  more 6 character long",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    //update user
    const updateUser = await userModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    updateUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Profile is update, please Login",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error update user API",
      error,
    });
  }
};

module.exports = {
  requierSignIn,
  registerController,
  loginController,
  updateUserController,
};
