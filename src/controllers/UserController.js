const User = require("../models/User");
const cryptoRandomString = require("crypto-random-string");

//register
exports.CreateUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.UserLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findByCredentials(phone, password);
    if (user.approved === false) {
      return res.status(405).send({ noAuth: "User is not allowed to login" });
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getProfileData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.send({ data: users });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.UserLogout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.send("Successfully Logout");
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.UserLogoutAll = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.tokens = [];
    await user.save();

    res.send("Successfully logout");
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.ApprovedUser = async (req, res) => {
  const updates = Object.keys(req.body);
  const fillables = ["approved"];
  const isValidate = updates.every((update) => fillables.includes(update));

  if (!isValidate) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const user = await User.findById(req.params.id);
    user.approved = true;
    await user.save();
    res.send({ data: "A User is approved" });
  } catch (e) {
    res.status(400).send({ error: e });
  }
};

exports.deletUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    await user.remove();
    res.send({ data: "User deleted successfully" });
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.changeUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ error: "User Not Found" });
    }
    const newPassword = getRandomInt();
    user.password = newPassword;
    await user.save();
    const userData = {
      phone: user.phone,
      newPassword,
    };
    res.send(userData);
  } catch (e) {
    res.status(500).send(e);
  }
};

exports.filterUser = async (req, res) => {
  try {
    const type = req.query.sortBy;
    let users = [];
    switch (type) {
      case "qruser":
        users = await User.find();
        console.log("user filter");
        break;

      default:
        break;
    }
    console.log(users);
    res.send({ data: users });
  } catch (e) {
    res.status(500).send(e);
  }
};

/*
 * Get random 6 numbers for OTP
 */
function getRandomInt() {
  let min = 100000;
  let max = 999999;
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
