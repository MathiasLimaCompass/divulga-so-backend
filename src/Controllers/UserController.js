const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

module.exports = {
  async createUser(req, res) {
    const { name, username, contact, password, city } = req.body;
    // criptografar a senha
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    try {
      const user = await User.create({
        name,
        username,
        contact,
        password: hash,
        city,
      });

      await user.save();
      res.status(200).json({
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  async getUsers(req, res) {
    try {
      const users = await User.find().select("-password");
      res.status(200).json({
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  async login(req, res) {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });

      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordCorrect = bcrypt.compareSync(password, user.password);

      if (!isPasswordCorrect) {
        throw new Error("Incorrect password");
      }

      const token = jsonwebtoken.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET
      );

      res.status(200).json({
        message: "User logged in successfully",
        token,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  // change picture
  async changePicture(req, res) {
    const { picture } = req.body;
    const { user } = req;

    try {
      user.picture = picture;
      await user.save();
      res.status(200).json({
        message: "Picture changed successfully",
        data: user,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
