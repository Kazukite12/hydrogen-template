const { createUser, findUserByUsername, findUserById } = require('./user.service');
const { generateToken } = require('../../utils/jwt.util');
const bcrypt = require('bcrypt');

module.exports = {
  register: (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    findUserByUsername(username,(err,user)=> {
      if(err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      if (user) {

        return res.status(403).json({ message: 'Username has already taken'});
      }
      createUser({ username, password }, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
      });
    })

   
  },

  login: (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    findUserByUsername(username, async (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const token = generateToken({ id: user.id, username: user.username });
      res.status(200).json({ message: 'Login successful', token });
    });
  },

  getProfile: (req, res) => {
    const userId = req.user.id;

    findUserById(userId, (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      res.status(200).json({ user });
    });
  },
};
