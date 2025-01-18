const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const signupUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "User name or password missing" });
  }

  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ username, password: hash });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    });

    res.status(201).json({ userID: user._id, username, accessToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "User name or password missing" });
  }

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ error: "User does not exist" })
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Incorrect Password" });
  }

  try {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    });

    res.json({ userID: user._id, username, accessToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const refreshTokenUser = async (req, res) => {
  const refreshToken = req.cookie.refreshToken;
  if (!refreshToken) {
    return res.sendStatue(401);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  });
};

const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.status(200).json({ message: "Logged out" });
};


module.exports = { signupUser, loginUser, refreshTokenUser, logoutUser };
