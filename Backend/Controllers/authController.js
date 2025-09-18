const UserModel = require("../Model/UserModel");
const Profile = require("../Model/Profile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const register = async (req, res) => {
  try {
   
    const { Name, Email, Password, UserType } = req.body;

    if (!Email || !Password || !Name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(Password, 15);

    const newUser = await UserModel.create({
      Email,
      Password: hashedPassword,
      Name,
      UserType: UserType || "REGULAR_USER",
    });

   await Profile.create({ user: newUser._id });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.json({
      Token: token,
      User: {
        id: newUser._id,
        Email: newUser.Email,
        Name: newUser.Name,
        UserType: newUser.UserType,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserModel.findOne({ Email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.json({
      Token: token,
      User: {
        id: user._id,
        Email: user.Email,
        Name: user.Name,
        UserType: user.UserType,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const GetByID = async (req, res) => { 
  const User = await User.findById(req.User._id).select("Password");
   res.json({  User })
   };

module.exports = { register, login,GetByID };
