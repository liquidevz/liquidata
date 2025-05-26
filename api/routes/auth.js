const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// @route   POST api/auth/login
// @desc    Authenticate admin & get token
// @access  Public
router.post(
  '/login',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Check if credentials match (using environment variables for simplicity)
      const isValidUsername = username === (process.env.ADMIN_USERNAME || 'admin');
      const isValidPassword = password === (process.env.ADMIN_PASSWORD || 'admin123');

      if (!isValidUsername || !isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Create and sign JWT
      const payload = {
        user: {
          id: 1,
          username: username,
          role: 'admin'
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your_jwt_secret_key_here',
        { expiresIn: '24h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router; 