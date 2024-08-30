const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const register = async (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ "message": "All fields required" });
  }

  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);

  try {
    await user.save();
    const token = user.generateJwt();
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json(err);
  }
};

const login = (req, res) => {
  if (!req.body.email || !req.body.password) {
   console.log('Missing email or password');
    return res.status(400).json({ "message": "All fields required" });
  }

  console.log('Email:', req.body.email);
  console.log('Password:', req.body.password);


  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(404).json(err);
    }
    if (user) {
      console.log('User authenticated:', user);
      const token = user.generateJwt();
      console.log('Generated token:', token);
      res.status(200).json({ token });
    } else {
      console.log('Authentication failed:', info);
      res.status(401).json(info);
    }
  })(req, res);
};

module.exports = {
  register,
  login
};
